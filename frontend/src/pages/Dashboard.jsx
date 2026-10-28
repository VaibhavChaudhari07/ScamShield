import { Link } from 'react-router-dom';
import {
  BarChart3, LineChart, PieChart, TrendingUp, ShieldCheck,
  AlertTriangle, ShieldX, HelpCircle, Link2, QrCode,
  MessageSquare, ArrowRight, Activity, Clock
} from 'lucide-react';
import {
  LineChart as ReLineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Legend,
  BarChart, Bar
} from 'recharts';
import { DEMO_DASHBOARD_STATS, DEMO_SCAN_TREND, DEMO_THREAT_FEED, DEMO_SCAN_HISTORY, RISK_COLORS } from '../data/mockData';
import { useScan } from '../context/ScanContext';
import RiskBadge from '../components/shared/RiskBadge';
import { formatDistanceToNow } from '../utils/dateUtils';

const DONUT_DATA = [
  { name: 'Safe', value: DEMO_DASHBOARD_STATS.safe, color: RISK_COLORS.safe },
  { name: 'Suspicious', value: DEMO_DASHBOARD_STATS.suspicious, color: RISK_COLORS.suspicious },
  { name: 'Malicious', value: DEMO_DASHBOARD_STATS.malicious, color: RISK_COLORS.malicious },
];

const TYPE_DATA = [
  { name: 'URL', value: DEMO_DASHBOARD_STATS.urlScans, color: '#60a5fa' },
  { name: 'QR Code', value: DEMO_DASHBOARD_STATS.qrScans, color: '#a78bfa' },
  { name: 'SMS', value: DEMO_DASHBOARD_STATS.smsScans, color: '#34d399' },
];

export default function Dashboard() {
  const { scanHistory } = useScan();
  const recent = scanHistory.slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Demo notice */}
      <div className="bg-amber-900/20 border border-amber-700/30 rounded-lg px-4 py-3 flex items-center gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
        <p className="text-sm text-amber-300">
          <span className="font-semibold">Demo Mode:</span> Statistics shown are sample data for demonstration purposes. Connect the ML backend to display real scan analytics.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Activity className="w-4 h-4" />} label="Total Scans" value={DEMO_DASHBOARD_STATS.totalScans.toLocaleString()} color="text-teal-400" bgColor="bg-teal-600/10 border-teal-600/20" />
        <StatCard icon={<ShieldCheck className="w-4 h-4" />} label="Safe" value={DEMO_DASHBOARD_STATS.safe.toLocaleString()} color="text-green-400" bgColor="bg-green-900/20 border-green-700/20" />
        <StatCard icon={<AlertTriangle className="w-4 h-4" />} label="Suspicious" value={DEMO_DASHBOARD_STATS.suspicious.toLocaleString()} color="text-amber-400" bgColor="bg-amber-900/20 border-amber-700/20" />
        <StatCard icon={<ShieldX className="w-4 h-4" />} label="Malicious" value={DEMO_DASHBOARD_STATS.malicious.toLocaleString()} color="text-red-400" bgColor="bg-red-900/20 border-red-700/20" />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <QuickAction to="/url-scanner" icon={<Link2 className="w-5 h-5 text-teal-400" />} title="Scan a URL" desc="Analyze a link for phishing" />
        <QuickAction to="/qr-scanner" icon={<QrCode className="w-5 h-5 text-teal-400" />} title="Scan a QR Code" desc="Upload or decode a QR image" />
        <QuickAction to="/sms-scanner" icon={<MessageSquare className="w-5 h-5 text-teal-400" />} title="Scan a Message" desc="Check SMS for scam patterns" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line chart */}
        <div className="card p-4 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-300">Scan Activity (Last 7 Days)</h3>
            <span className="demo-badge">Demo data</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <ReLineChart data={DEMO_SCAN_TREND} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4a" />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#0f1a2e', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Line type="monotone" dataKey="scans" stroke="#0d9488" strokeWidth={2} dot={false} name="Total Scans" />
              <Line type="monotone" dataKey="malicious" stroke="#f87171" strokeWidth={2} dot={false} name="Malicious" />
            </ReLineChart>
          </ResponsiveContainer>
        </div>

        {/* Donut chart */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-slate-300">Risk Distribution</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <RePieChart>
              <Pie data={DONUT_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                {DONUT_DATA.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Legend
                formatter={(v) => <span className="text-xs text-slate-400">{v}</span>}
                wrapperStyle={{ paddingTop: 8 }}
              />
              <Tooltip contentStyle={{ background: '#0f1a2e', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }} />
            </RePieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Scan type bar + Threat feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-4">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Scans by Type</h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={TYPE_DATA} layout="vertical" margin={{ left: 0, right: 10 }}>
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} width={60} />
              <Tooltip contentStyle={{ background: '#0f1a2e', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {TYPE_DATA.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Threat feed */}
        <div className="card p-4 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-300">Active Threat Intelligence</h3>
            <span className="demo-badge">Demo data</span>
          </div>
          <div className="space-y-2">
            {DEMO_THREAT_FEED.map((threat) => (
              <div key={threat.domain} className="flex items-center gap-3 p-2.5 bg-navy-700/40 rounded-lg hover:bg-navy-700/60 transition-colors">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${threat.severity === 'critical' ? 'bg-red-400' : threat.severity === 'high' ? 'bg-orange-400' : 'bg-amber-400'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-200 font-mono truncate">{threat.domain}</p>
                  <p className="text-xs text-slate-500">{threat.type}</p>
                </div>
                <span className="text-xs text-slate-500">{threat.reports} reports</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent scans */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-300">Recent Scans</h3>
          <Link to="/history" className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1 transition-colors">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="text-sm text-slate-500 py-6 text-center">No scans yet. Try scanning a URL or QR code.</p>
        ) : (
          <div className="space-y-2">
            {recent.map((scan) => (
              <div key={scan.id} className="flex items-center gap-3 p-2.5 bg-navy-700/30 rounded-lg hover:bg-navy-700/50 transition-colors">
                <div className="w-7 h-7 bg-navy-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  {scan.type === 'qr' ? <QrCode className="w-3.5 h-3.5 text-slate-400" /> :
                   scan.type === 'sms' ? <MessageSquare className="w-3.5 h-3.5 text-slate-400" /> :
                   <Link2 className="w-3.5 h-3.5 text-slate-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-200 truncate font-mono text-xs">{scan.input}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" /> {formatDistanceToNow(scan.timestamp)}
                  </p>
                </div>
                <RiskBadge classification={scan.classification} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color, bgColor }) {
  return (
    <div className={`card border p-4 ${bgColor}`}>
      <div className={`flex items-center gap-2 mb-2 ${color}`}>
        {icon}
        <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
      </div>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-slate-600 mt-0.5">Demo data</p>
    </div>
  );
}

function QuickAction({ to, icon, title, desc }) {
  return (
    <Link to={to} className="card p-4 hover:border-teal-600/40 hover:bg-navy-700/40 transition-all duration-200 group flex items-center gap-3">
      <div className="w-10 h-10 bg-teal-600/15 border border-teal-500/25 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-teal-600/25 transition-colors">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white group-hover:text-teal-400 transition-colors">{title}</p>
        <p className="text-xs text-slate-500">{desc}</p>
      </div>
      <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-teal-400 transition-colors flex-shrink-0" />
    </Link>
  );
}
