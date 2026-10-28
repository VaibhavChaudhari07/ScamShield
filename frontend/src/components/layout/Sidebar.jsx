import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard, Link2, QrCode, MessageSquare, History,
  AlertTriangle, BarChart3, BookOpen, Settings, Shield,
  Wifi, ChevronRight, ShieldCheck
} from 'lucide-react';
import clsx from 'clsx';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'Overview' },
  { to: '/url-scanner', label: 'URL Scanner', icon: Link2, section: 'Scan' },
  { to: '/qr-scanner', label: 'QR Scanner', icon: QrCode, section: 'Scan' },
  { to: '/sms-scanner', label: 'Message Scanner', icon: MessageSquare, section: 'Scan' },
  { to: '/history', label: 'Scan History', icon: History, section: 'Reports' },
  { to: '/threats', label: 'Threat Reports', icon: AlertTriangle, section: 'Reports' },
  { to: '/analytics', label: 'Security Analytics', icon: BarChart3, section: 'Reports' },
  { to: '/academy', label: 'Security Academy', icon: BookOpen, section: 'Learn' },
  { to: '/settings', label: 'Settings', icon: Settings, section: 'Account' },
];

const SECTIONS = ['Overview', 'Scan', 'Reports', 'Learn', 'Account'];

export default function Sidebar({ onClose }) {
  return (
    <aside className="flex flex-col h-full bg-navy-900 border-r border-slate-700/50 w-64 flex-shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-700/50">
        <Link to="/" className="flex items-center gap-3 group" onClick={onClose}>
          <div className="w-9 h-9 bg-teal-600/20 border border-teal-500/40 rounded-lg flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-5 h-5 text-teal-400" />
          </div>
          <div>
            <span className="text-white font-bold text-base leading-none">ScamShield</span>
            <span className="block text-teal-400 text-xs font-semibold tracking-wider mt-0.5">AI</span>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-5">
        {SECTIONS.map(section => {
          const items = NAV_ITEMS.filter(n => n.section === section);
          return (
            <div key={section}>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest px-3 mb-1.5">{section}</p>
              {items.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    clsx('nav-link', isActive && 'active')
                  }
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{label}</span>
                </NavLink>
              ))}
            </div>
          );
        })}
      </nav>

      {/* Status */}
      <div className="px-4 py-4 border-t border-slate-700/50">
        <div className="bg-navy-800 rounded-lg p-3 border border-slate-700/40">
          <div className="flex items-center gap-2 mb-2">
            <Wifi className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-xs text-slate-500 font-medium">Protection Status</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse-slow" />
            <span className="text-xs text-amber-400 font-medium">Demo Mode Active</span>
          </div>
          <p className="text-xs text-slate-600 mt-1">Connect ML API to go live</p>
        </div>
      </div>
    </aside>
  );
}
