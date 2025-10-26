import { useMemo, useState } from 'react';
import TopNav from './components/TopNav';
import HeroCover from './components/HeroCover';
import Dashboard from './components/Dashboard';
import AttendanceSuite from './components/AttendanceSuite';

export default function App() {
  const [auth, setAuth] = useState({ isAuthenticated: true, role: 'manager', user: { name: 'Alex Manager', email: 'alex@example.com' } });

  const theme = useMemo(() => ({
    colors: {
      primary: '#3f51b5',
      accent: '#e91e63',
      success: '#22c55e',
      danger: '#ef4444',
      warning: '#eab308',
      muted: '#6b7280',
    },
  }), []);

  const handleSignInOut = () => {
    if (auth.isAuthenticated) {
      setAuth({ isAuthenticated: false, role: 'guest', user: null });
    } else {
      setAuth({ isAuthenticated: true, role: 'manager', user: { name: 'Alex Manager', email: 'alex@example.com' } });
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <TopNav
        theme={theme}
        auth={auth}
        onToggleAuth={handleSignInOut}
        onSwitchRole={() => setAuth((a) => a.isAuthenticated ? { ...a, role: a.role === 'manager' ? 'employee' : 'manager' } : a)}
      />

      <main id="main" className="flex flex-col">
        <HeroCover theme={theme} />

        <section aria-labelledby="dashboard-heading" className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Dashboard theme={theme} auth={auth} />
        </section>

        <section aria-labelledby="attendance-suite-heading" className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <AttendanceSuite theme={theme} auth={auth} />
        </section>
      </main>

      <footer className="border-t border-gray-200 py-6 mt-auto" aria-label="Footer">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-sm text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} TeamTrack. All rights reserved.</p>
          <nav className="flex items-center gap-4" aria-label="Footer links">
            <a href="#" className="hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded">Privacy</a>
            <a href="#" className="hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded">Terms</a>
            <a href="#main" className="hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded">Skip to content</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
