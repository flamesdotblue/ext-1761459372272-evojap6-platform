import { CalendarDays, Users, CheckCircle2, AlertCircle, Timer, Download } from 'lucide-react';

export default function Dashboard({ theme, auth }) {
  const cards = [
    { label: 'Present', value: 142, icon: CheckCircle2, color: 'bg-green-50 text-green-700', ring: 'ring-green-200' },
    { label: 'Absent', value: 12, icon: AlertCircle, color: 'bg-red-50 text-red-700', ring: 'ring-red-200' },
    { label: 'Late', value: 9, icon: Timer, color: 'bg-yellow-50 text-yellow-700', ring: 'ring-yellow-200' },
    { label: 'Employees', value: 58, icon: Users, color: 'bg-indigo-50 text-indigo-700', ring: 'ring-indigo-200' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 id="dashboard-heading" className="text-xl sm:text-2xl font-semibold" style={{ color: theme.colors.primary }}>Dashboard</h2>
        <div className="flex items-center gap-3">
          <a href="#attendance" className="inline-flex items-center gap-2 rounded-md bg-indigo-600 text-white px-3 py-2 text-sm font-medium hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <CalendarDays size={16} /> Quick mark
          </a>
          <button className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white text-gray-800 px-3 py-2 text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" aria-label="Download overview report">
            <Download size={16} /> Export
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className={`rounded-lg p-4 ring-1 ${c.ring} ${c.color}`} role="status" aria-label={`${c.label} ${c.value}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{c.label}</p>
                <p className="mt-1 text-2xl font-bold">{c.value}</p>
              </div>
              <c.icon aria-hidden="true" />
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-gray-200 p-4 sm:p-6">
        <p className="text-sm text-gray-700">
          {auth.isAuthenticated ? (
            <>Welcome back, <span className="font-medium">{auth.user?.name}</span>. Your role is <span className="font-medium">{auth.role}</span>.</>
          ) : (
            <>You are exploring as a guest. Sign in to manage attendance and roles.</>
          )}
        </p>
      </div>
    </div>
  );
}
