import { useState } from 'react';
import { MessageSquare, AlertTriangle, Loader2, X, Search, Link2, ChevronRight } from 'lucide-react';
import { simulateUrlAnalysis } from '../data/mockData';
import { useScan } from '../context/ScanContext';
import RiskBadge from '../components/shared/RiskBadge';

const LANGUAGES = ['English', 'Hindi', 'Marathi', 'Hinglish'];

const SCAM_PATTERNS = [
  { key: 'urgency', label: 'Urgency language', pattern: /urgent|immediately|expire|last chance|act now|within \d+ hour/i },
  { key: 'prize', label: 'Prize / reward claim', pattern: /won|winner|prize|lottery|free|claim now|reward/i },
  { key: 'bank', label: 'Bank / financial impersonation', pattern: /sbi|hdfc|icici|axis|paytm|upi|kyc|account blocked|transaction/i },
  { key: 'govt', label: 'Government impersonation', pattern: /pm kisan|income tax|irdai|epfo|aadhaar|pan card/i },
  { key: 'otp', label: 'OTP / credential request', pattern: /otp|one.?time.?pass|do not share|pin|password/i },
  { key: 'personal', label: 'Personal information request', pattern: /date of birth|aadhar|pan|cvv|card number/i },
];

const EXAMPLES = [
  'Dear Customer, your SBI account will be blocked. Update KYC immediately at https://sbi-kyc-now.xyz',
  'Congratulations! You won Rs.50,000 in our lucky draw. Claim at http://prize-claim.tk/win',
  'Hi, please see the document I shared with you: https://docs.google.com/document/d/example',
];

export default function SmsScanner() {
  const [text, setText] = useState('');
  const [lang, setLang] = useState('English');
  const [result, setResult] = useState(null);
  const [scanning, setScanning] = useState(false);
  const { addScan } = useScan();

  function extractUrls(t) {
    const regex = /https?:\/\/[^\s]+|www\.[^\s]+|[a-z0-9-]+\.[a-z]{2,}\/[^\s]*/gi;
    return [...new Set(t.match(regex) || [])];
  }

  async function handleScan() {
    if (!text.trim()) return;
    setScanning(true);
    setResult(null);
    await new Promise(r => setTimeout(r, 1000));

    const urls = extractUrls(text);
    const matchedPatterns = SCAM_PATTERNS.filter(p => p.pattern.test(text));
    let score = matchedPatterns.length * 15;

    const urlResults = [];
    for (const url of urls.slice(0, 3)) {
      const r = await simulateUrlAnalysis(url);
      urlResults.push({ url, ...r });
      score += r.score * 0.4;
    }

    score = Math.min(100, Math.floor(score));
    const classification = score >= 70 ? 'malicious' : score >= 30 ? 'suspicious' : 'safe';

    const r = {
      text: text.trim(),
      urls,
      urlResults,
      matchedPatterns,
      classification,
      score,
      language: lang,
      isDemo: true,
      scannedAt: new Date().toISOString(),
    };
    addScan({ ...r, type: 'sms', input: text.slice(0, 80), domain: urls[0] || 'SMS message', url: text.slice(0, 80) });
    setResult(r);
    setScanning(false);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <div className="flex items-center gap-2 text-teal-400 mb-1">
          <MessageSquare className="w-4.5 h-4.5" />
          <span className="text-xs font-semibold uppercase tracking-widest">Message Scanner</span>
        </div>
        <h2 className="text-xl font-bold text-white">Analyze a suspicious SMS or message</h2>
        <p className="text-sm text-slate-400 mt-1">Paste the message to detect scam patterns, urgency language, and embedded malicious links.</p>
      </div>

      <div className="card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Message Text</label>
          <select
            value={lang}
            onChange={e => setLang(e.target.value)}
            className="bg-navy-700 border border-slate-600 text-slate-300 text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-teal-500"
          >
            {LANGUAGES.map(l => <option key={l}>{l}</option>)}
          </select>
        </div>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          rows={5}
          placeholder="Paste a suspicious SMS, WhatsApp message, or email text here…"
          className="input-field resize-none text-sm leading-relaxed"
          disabled={scanning}
        />

        {/* Examples */}
        <div>
          <p className="text-xs text-slate-600 mb-2">Try an example:</p>
          <div className="space-y-1.5">
            {EXAMPLES.map((ex, i) => (
              <button key={i} onClick={() => setText(ex)} className="w-full text-left text-xs text-slate-400 hover:text-teal-300 bg-navy-700/40 hover:bg-navy-700 rounded-lg px-3 py-2 transition-colors flex items-start gap-2">
                <ChevronRight className="w-3 h-3 text-teal-500 flex-shrink-0 mt-0.5" />
                <span className="truncate">{ex}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={handleScan} disabled={scanning || !text.trim()} className="btn-primary flex-1 justify-center">
            {scanning ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing…</> : <><Search className="w-4 h-4" /> Analyze Message</>}
          </button>
          {text && <button onClick={() => { setText(''); setResult(null); }} className="btn-secondary"><X className="w-4 h-4" /></button>}
        </div>
      </div>

      {result && (
        <div className="space-y-4 animate-fade-in">
          {/* Message risk */}
          <div className={`card p-4 border ${result.classification === 'malicious' ? 'border-red-700/40 bg-red-900/10' : result.classification === 'suspicious' ? 'border-amber-700/40 bg-amber-900/10' : 'border-green-700/40 bg-green-900/10'}`}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-white">Message Risk Assessment</p>
              <RiskBadge classification={result.classification} />
            </div>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex-1 bg-navy-700 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${result.score >= 70 ? 'bg-red-400' : result.score >= 30 ? 'bg-amber-400' : 'bg-green-400'}`}
                  style={{ width: `${result.score}%` }}
                />
              </div>
              <span className="text-sm font-bold text-slate-200 w-12">{result.score}/100</span>
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span className="demo-badge">Demo result</span>
              Language: {result.language}
            </p>
          </div>

          {/* Detected patterns */}
          {result.matchedPatterns.length > 0 && (
            <div className="card p-4">
              <p className="text-sm font-semibold text-slate-300 mb-3">Scam Indicators Detected</p>
              <div className="space-y-2">
                {result.matchedPatterns.map(p => (
                  <div key={p.key} className="flex items-center gap-2.5 p-2.5 bg-amber-900/20 border border-amber-700/20 rounded-lg">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span className="text-sm text-amber-300">{p.label}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-600 mt-2 italic">
                Scam indicators are based on keyword patterns. A message may be suspicious even without a URL, or safe despite matching keywords.
              </p>
            </div>
          )}

          {/* Extracted URLs */}
          {result.urls.length > 0 && (
            <div className="card p-4">
              <p className="text-sm font-semibold text-slate-300 mb-3">
                <span className="flex items-center gap-2"><Link2 className="w-4 h-4 text-teal-400" /> Extracted URLs ({result.urls.length})</span>
              </p>
              <div className="space-y-3">
                {result.urlResults.map((ur, i) => (
                  <div key={i} className={`p-3 rounded-lg border ${ur.classification === 'malicious' ? 'bg-red-900/15 border-red-700/30' : ur.classification === 'suspicious' ? 'bg-amber-900/15 border-amber-700/30' : 'bg-green-900/15 border-green-700/30'}`}>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-xs font-mono text-slate-300 break-all">{ur.url}</p>
                      <RiskBadge classification={ur.classification} />
                    </div>
                    <p className="text-xs text-slate-500">Score: {ur.score}/100</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.urls.length === 0 && result.matchedPatterns.length === 0 && (
            <div className="card p-4 text-center">
              <p className="text-sm text-green-400">No URLs or obvious scam patterns detected in this message.</p>
              <p className="text-xs text-slate-500 mt-1">Exercise caution regardless — not all scams contain links.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
