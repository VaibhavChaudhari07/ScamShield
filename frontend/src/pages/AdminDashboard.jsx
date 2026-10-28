import { Shield, Users, AlertTriangle, BarChart3, CheckCircle, Clock, Database } from 'lucide-react';
import { DEMO_DASHBOARD_STATS } from '../data/mockData';

const FALSE_POSITIVES = [
  { id: 'fp_001', url: 'https://legitimate-bank.co.in/login', score: 74, reporter: 'user_082', status: 'pending' },
  { id: 'fp_002', url: 'https://secure.ndtv.com/news/report', score: 68, reporter: 'user_041', status: 'pending' },
  { id: 'fp_003', url: 'https://mail.google.com/mail/verify', score: 61, reporter: 'user_113', status: 'resolved' },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Access notice */}
      <div className="bg-amber-900/20 border border-amber-700/30 rounded-lg px-4 py-3 flex items-center gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
        <p className="text-sm text-amber-300">
          <span className="font-semibold">Admin area:</span> In production, this page must be protected by backend authentication. Do not rely solely on frontend access control.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-bold text-white">Admin Dashboard</h2>
        <p className="text-sm text-slate-400 mt-1">System overview, model status, and moderation queue.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Scans', value: DEMO_DASHBOARD_STATS.totalScans.toLocaleString(), icon: <BarChart3 className="w-4 h-4" />, color: 'text-teal-400' },
          { label: 'Threats Flagged', value: (DEMO_DASHBOARD_STATS.malicious + DEMO_DASHBOARD_STATS.suspicious).toLocaleString(), icon: <AlertTriangle className="w-4 h-4" />, color: 'text-red-400' },
          { label: 'User Reports', value: '47', icon: <Users className="w-4 h-4" />, color: 'text-amber-400' },
          { label: 'False Positive Queue', value: FALSE_POSITIVES.filter(f => f.status === 'pending').length.toString(), icon: <CheckCircle className="w-4 h-4" />, color: 'text-green-400' },
        ].map(s => (
          <div key={s.label} className="card p-4">
            <div className={`flex items-center gap-2 mb-1 ${s.color}`}>
              {s.icon}
              <span className="text-xs font-semibold">{s.label}</span>
            </div>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Model status */}
      <div className="card p-4">
        <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
          <Database className="w-4 h-4 text-teal-400" /> Model & System Status
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: 'Model Version', value: 'ScamShield-v0.1-demo', status: 'demo' },
            { label: 'Last Training', value: 'Not applicable (demo)', status: 'demo' },
            { label: 'Detection API', value: 'Not connected', status: 'offline' },
            { label: 'VirusTotal Integration', value: 'Not configured', status: 'offline' },
            { label: 'Threat Feed', value: 'Demo data only', status: 'demo' },
            { label: 'Dataset Size', value: 'N/A — connect backend', status: 'offline' },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between p-2.5 bg-navy-700/40 rounded-lg">
              <p className="text-sm text-slate-300">{item.label}</p>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${item.status === 'online' ? 'bg-green-400' : item.status === 'demo' ? 'bg-amber-400' : 'bg-slate-600'}`} />
                <span className="text-xs text-slate-400">{item.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* False positive queue */}
      <div className="card p-4">
        <h3 className="text-sm font-semibold text-slate-300 mb-4">False Positive Feedback Queue</h3>
        <div className="space-y-2">
          {FALSE_POSITIVES.map(fp => (
            <div key={fp.id} className="flex items-center gap-3 p-3 bg-navy-700/40 rounded-lg">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${fp.status === 'pending' ? 'bg-amber-400 animate-pulse' : 'bg-green-400'}`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-mono text-slate-300 truncate">{fp.url}</p>
                <p className="text-xs text-slate-500">Score: {fp.score} · Reporter: {fp.reporter}</p>
              </div>
              <div className="flex gap-2">
                {fp.status === 'pending' && (
                  <>
                    <button className="text-xs bg-green-900/40 text-green-400 border border-green-700/40 px-2 py-1 rounded hover:bg-green-900/60 transition-colors">Confirm FP</button>
                    <button className="text-xs bg-red-900/40 text-red-400 border border-red-700/40 px-2 py-1 rounded hover:bg-red-900/60 transition-colors">Reject</button>
                  </>
                )}
                {fp.status === 'resolved' && <span className="text-xs text-green-400 flex items-center gap-1"><CheckCircle className="w-3 h-3" />Resolved</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scan distribution */}
      <div className="card p-4">
        <h3 className="text-sm font-semibold text-slate-300 mb-4">Scan Type Distribution</h3>
        <div className="space-y-2">
          {[
            { label: 'URL Scans', value: DEMO_DASHBOARD_STATS.urlScans, total: DEMO_DASHBOARD_STATS.totalScans, color: 'bg-teal-500' },
            { label: 'QR Scans', value: DEMO_DASHBOARD_STATS.qrScans, total: DEMO_DASHBOARD_STATS.totalScans, color: 'bg-blue-500' },
            { label: 'SMS Scans', value: DEMO_DASHBOARD_STATS.smsScans, total: DEMO_DASHBOARD_STATS.totalScans, color: 'bg-purple-500' },
          ].map(s => (
            <div key={s.label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">{s.label}</span>
                <span className="text-slate-300">{s.value} ({Math.round(s.value / s.total * 100)}%)</span>
              </div>
              <div className="h-2 bg-navy-700 rounded-full">
                <div className={`h-2 rounded-full ${s.color}`} style={{ width: `${s.value / s.total * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
