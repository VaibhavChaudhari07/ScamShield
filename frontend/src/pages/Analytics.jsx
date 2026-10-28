import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { DEMO_SCAN_TREND, DEMO_DASHBOARD_STATS, RISK_COLORS } from '../data/mockData';
import { BarChart3, AlertTriangle } from 'lucide-react';

const HOURLY = [
  { hour: '00', scans: 3 }, { hour: '03', scans: 1 }, { hour: '06', scans: 5 },
  { hour: '09', scans: 12 }, { hour: '12', scans: 18 }, { hour: '15', scans: 22 },
  { hour: '18', scans: 15 }, { hour: '21', scans: 8 },
];

const TYPE_BREAKDOWN = [
  { name: 'URL', safe: 620, suspicious: 158, malicious: 56 },
  { name: 'QR Code', safe: 221, suspicious: 67, malicious: 24 },
  { name: 'SMS', safe: 50, suspicious: 22, malicious: 66 },
];

const RISK_PIE = [
  { name: 'Safe', value: DEMO_DASHBOARD_STATS.safe, color: RISK_COLORS.safe },
  { name: 'Suspicious', value: DEMO_DASHBOARD_STATS.suspicious, color: RISK_COLORS.suspicious },
  { name: 'Malicious', value: DEMO_DASHBOARD_STATS.malicious, color: RISK_COLORS.malicious },
];

const TOOLTIP_STYLE = {
  contentStyle: { background: '#0f1a2e', border: '1px solid #334155', borderRadius: 8, fontSize: 12 },
  labelStyle: { color: '#94a3b8' },
};

export default function Analytics() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-white">Security Analytics</h2>
        <p className="text-sm text-slate-400 mt-0.5">Risk trends and scan statistics across all scan types.</p>
        <span className="demo-badge mt-2 inline-flex"><AlertTriangle className="w-3 h-3" />Demo data</span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Scans', value: DEMO_DASHBOARD_STATS.totalScans.toLocaleString(), sub: 'All time demo' },
          { label: 'Safe Rate', value: `${Math.round(DEMO_DASHBOARD_STATS.safe / DEMO_DASHBOARD_STATS.totalScans * 100)}%`, sub: 'of scans' },
          { label: 'Malicious Rate', value: `${Math.round(DEMO_DASHBOARD_STATS.malicious / DEMO_DASHBOARD_STATS.totalScans * 100)}%`, sub: 'of scans' },
          { label: 'Avg. Daily Scans', value: '183', sub: '7-day avg' },
        ].map(k => (
          <div key={k.label} className="card p-4">
            <p className="text-xl font-bold text-teal-400">{k.value}</p>
            <p className="text-xs text-slate-400 font-medium mt-0.5">{k.label}</p>
            <p className="text-xs text-slate-600">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* 7-day trend */}
      <div className="card p-4">
        <h3 className="text-sm font-semibold text-slate-300 mb-4">7-Day Scan Trend</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={DEMO_SCAN_TREND} margin={{ left: -20, right: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4a" />
            <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip {...TOOLTIP_STYLE} />
            <Legend formatter={v => <span className="text-xs text-slate-400">{v}</span>} />
            <Line type="monotone" dataKey="scans" stroke="#0d9488" strokeWidth={2} dot={{ r: 3 }} name="Total Scans" />
            <Line type="monotone" dataKey="malicious" stroke="#f87171" strokeWidth={2} dot={{ r: 3 }} name="Malicious" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly distribution */}
        <div className="card p-4">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Hourly Scan Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={HOURLY} margin={{ left: -20, right: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4a" />
              <XAxis dataKey="hour" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}:00`} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Bar dataKey="scans" fill="#0d9488" radius={[4, 4, 0, 0]} name="Scans" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Risk breakdown by type */}
        <div className="card p-4">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Risk Breakdown by Scan Type</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={TYPE_BREAKDOWN} margin={{ left: -20, right: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4a" />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Legend formatter={v => <span className="text-xs text-slate-400 capitalize">{v}</span>} />
              <Bar dataKey="safe" stackId="a" fill={RISK_COLORS.safe} radius={[0, 0, 0, 0]} />
              <Bar dataKey="suspicious" stackId="a" fill={RISK_COLORS.suspicious} />
              <Bar dataKey="malicious" stackId="a" fill={RISK_COLORS.malicious} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Donut + table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-4">
          <h3 className="text-sm font-semibold text-slate-300 mb-2">Overall Risk Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={RISK_PIE} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {RISK_PIE.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip {...TOOLTIP_STYLE} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-4">
          <h3 className="text-sm font-semibold text-slate-300 mb-3">Classification Summary</h3>
          <div className="space-y-3">
            {RISK_PIE.map(r => {
              const pct = Math.round(r.value / DEMO_DASHBOARD_STATS.totalScans * 100);
              return (
                <div key={r.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">{r.name}</span>
                    <span className="text-slate-300 font-semibold">{r.value.toLocaleString()} <span className="text-slate-500 font-normal">({pct}%)</span></span>
                  </div>
                  <div className="h-2 bg-navy-700 rounded-full overflow-hidden">
                    <div className="h-2 rounded-full" style={{ width: `${pct}%`, background: r.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
