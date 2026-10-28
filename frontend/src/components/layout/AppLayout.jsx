import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Menu, X, Bell, User, Search } from 'lucide-react';
import Sidebar from './Sidebar';

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/url-scanner': 'URL Scanner',
  '/qr-scanner': 'QR Scanner',
  '/sms-scanner': 'Message Scanner',
  '/history': 'Scan History',
  '/threats': 'Threat Reports',
  '/analytics': 'Security Analytics',
  '/academy': 'Security Academy',
  '/settings': 'Settings',
  '/admin': 'Admin Dashboard',
};

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] || 'ScamShield AI';

  return (
    <div className="flex h-screen bg-navy-950 overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — hidden on mobile, slide in */}
      <div className={`
        fixed inset-y-0 left-0 z-30 lg:relative lg:flex lg:translate-x-0
        transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-14 flex items-center gap-3 px-4 border-b border-slate-700/50 bg-navy-900 flex-shrink-0">
          <button
            className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-navy-700 transition-colors"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-semibold text-slate-100 truncate">{title}</h1>
          </div>

          <div className="flex items-center gap-1">
            <span className="demo-badge hidden sm:inline-flex">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Demo Mode
            </span>
            <button className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-navy-700 transition-colors" aria-label="Notifications">
              <Bell className="w-4.5 h-4.5" />
            </button>
            <button className="w-8 h-8 rounded-full bg-teal-600/30 border border-teal-500/40 flex items-center justify-center text-teal-400 hover:bg-teal-600/50 transition-colors" aria-label="User profile">
              <User className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-navy-950 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
