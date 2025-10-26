import Spline from '@splinetool/react-spline';
import { Rocket } from 'lucide-react';

export default function HeroCover({ theme }) {
  return (
    <section className="relative w-full h-[60vh] min-h-[360px]" aria-label="Interactive cover">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/zhZFnwyOYLgqlLWk/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/60 to-transparent pointer-events-none" aria-hidden="true" />
      <div className="relative h-full container mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-10">
        <div className="max-w-2xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight" style={{ color: theme.colors.primary }}>
            Modern Employee Attendance & Role Management
          </h1>
          <p className="mt-3 text-base sm:text-lg text-gray-700">
            Track attendance, manage roles, and generate reports with an accessible, responsive interface.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <a href="#attendance" className="inline-flex items-center gap-2 rounded-md bg-indigo-600 text-white px-4 py-2 text-sm font-medium hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <Rocket size={16} />
              Get Started
            </a>
            <a href="#reports" className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white text-gray-800 px-4 py-2 text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              View Reports
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
