import { AlertTriangle, TrendingUp, Globe, Shield, Flag } from 'lucide-react';

const THREATS = [
  { domain: 'paypal-secure-login.tk', type: 'Phishing', reports: 34, severity: 'critical', first: '2026-10-20', last: '2026-10-28', desc: 'Credential harvesting page impersonating PayPal login.' },
  { domain: 'amazon-refund-claims.net', type: 'Scam page', reports: 28, severity: 'high', first: '2026-10-22', last: '2026-10-27', desc: 'Fake Amazon refund claim form collecting card details.' },
  { domain: 'sbi-kyc-update.xyz', type: 'Bank impersonation', reports: 21, severity: 'high', first: '2026-10-18', last: '2026-10-28', desc: 'Impersonates SBI with urgent KYC update messaging.' },
  { domain: 'free-iphone15-winner.com', type: 'Prize scam', reports: 15, severity: 'medium', first: '2026-10-25', last: '2026-10-28', desc: 'Fake prize notification requiring personal information.' },
  { domain: 'hdfc-netbanklng.in', type: 'Typosquatting', reports: 19, severity: 'high', first: '2026-10-15', last: '2026-10-26', desc: 'Typosquatted HDFC domain targeting login credentials.' },
  { domain: 'gov-refund-pm.tk', type: 'Govt impersonation', reports: 11, severity: 'medium', first: '2026-10-24', last: '2026-10-27', desc: 'Impersonates PM relief fund to collect bank details.' },
];

const SEVERITY_COLORS = {
  critical: 'text-red-400 bg-red-900/30 border-red-700/40',
  high: 'text-orange-400 bg-orange-900/30 border-orange-700/40',
  medium: 'text-amber-400 bg-amber-900/30 border-amber-700/40',
};

export default function ThreatReports() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-white">Threat Reports</h2>
        <p className="text-sm text-slate-400 mt-1">Community-reported malicious domains and scam infrastructure.</p>
        <span className="demo-badge mt-2 inline-flex">Demo data — not real threat intelligence</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Active Threats', value: THREATS.length, color: 'text-red-400' },
          { label: 'Critical', value: THREATS.filter(t => t.severity === 'critical').length, color: 'text-red-400' },
          { label: 'High', value: THREATS.filter(t => t.severity === 'high').length, color: 'text-orange-400' },
          { label: 'Reports This Week', value: THREATS.reduce((a, t) => a + t.reports, 0), color: 'text-teal-400' },
        ].map(s => (
          <div key={s.label} className="card p-4">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {THREATS.map(t => (
          <div key={t.domain} className="card p-4 hover:border-slate-600 transition-colors">
            <div className="flex items-start gap-3">
              <AlertTriangle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${t.severity === 'critical' ? 'text-red-400' : t.severity === 'high' ? 'text-orange-400' : 'text-amber-400'}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="text-sm font-mono font-semibold text-white">{t.domain}</p>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border capitalize ${SEVERITY_COLORS[t.severity]}`}>{t.severity}</span>
                  <span className="badge-unknown">{t.type}</span>
                </div>
                <p className="text-xs text-slate-400 mb-2">{t.desc}</p>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Flag className="w-3 h-3" />{t.reports} reports</span>
                  <span>First: {t.first}</span>
                  <span>Last seen: {t.last}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-4 bg-navy-800/50">
        <div className="flex items-start gap-3">
          <Globe className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-slate-300 mb-1">Report a threat</p>
            <p className="text-xs text-slate-400">Spotted a phishing site or malicious QR? Report it to help protect others.</p>
            <p className="text-xs text-slate-500 mt-1">India: <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:underline">cybercrime.gov.in</a> — Helpline: 1930</p>
          </div>
        </div>
      </div>
    </div>
  );
}
