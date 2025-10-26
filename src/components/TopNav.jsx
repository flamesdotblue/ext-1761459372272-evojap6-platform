import { Home, Users, Calendar, FileText, Shield, LogIn, LogOut, User } from 'lucide-react';

export default function TopNav({ theme, auth, onToggleAuth, onSwitchRole }) {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-200" role="banner">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded bg-indigo-100 flex items-center justify-center" aria-hidden="true">
            <Shield className="text-indigo-600" size={18} />
          </div>
          <a href="#" className="text-lg font-semibold" aria-label="TeamTrack Home" style={{ color: theme.colors.primary }}>TeamTrack</a>
        </div>
        <nav className="hidden md:flex items-center gap-6" aria-label="Primary">
          <a href="#" className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded"><Home size={16} /> Home</a>
          <a href="#employees" className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded"><Users size={16} /> Employees</a>
          <a href="#attendance" className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded"><Calendar size={16} /> Attendance</a>
          <a href="#reports" className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded"><FileText size={16} /> Reports</a>
        </nav>
        <div className="flex items-center gap-3">
          <span className="sr-only">Authentication</span>
          <button
            type="button"
            onClick={onToggleAuth}
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            aria-pressed={auth.isAuthenticated}
          >
            {auth.isAuthenticated ? <LogOut size={16} /> : <LogIn size={16} />}
            {auth.isAuthenticated ? 'Sign out' : 'Sign in'}
          </button>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600" role="status" aria-live="polite">
              <User size={16} aria-hidden="true" />
              {auth.isAuthenticated ? (
                <span>{auth.user?.name} · {auth.role}</span>
              ) : (
                <span>Guest</span>
              )}
            </div>
            {auth.isAuthenticated && (
              <button
                type="button"
                onClick={onSwitchRole}
                className="rounded-md bg-indigo-600 text-white px-3 py-2 text-sm font-medium hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                aria-label="Switch role"
                title="Switch role"
              >
                Switch to {auth.role === 'manager' ? 'employee' : 'manager'}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
