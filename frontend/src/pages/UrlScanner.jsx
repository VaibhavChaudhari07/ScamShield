import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link2, Search, X, AlertTriangle, Loader2, CheckCircle, ChevronRight } from 'lucide-react';
import { simulateUrlAnalysis } from '../data/mockData';
import { useScan } from '../context/ScanContext';
import ScanResultCard from '../components/shared/ScanResultCard';

const SCAN_STEPS = [
  { id: 'parse', label: 'URL syntax validation' },
  { id: 'domain', label: 'Domain extraction & analysis' },
  { id: 'tls', label: 'TLS / HTTPS verification' },
  { id: 'brand', label: 'Brand impersonation check' },
  { id: 'threat', label: 'Threat intelligence lookup' },
  { id: 'ai', label: 'AI risk scoring' },
];

const EXAMPLE_URLS = [
  'https://github.com/torvalds/linux',
  'https://paypal-secure-verify.net/login',
  'http://bit.ly/3qWs9Pp',
  'https://hdfc-netbanklng.in/account',
];

export default function UrlScanner() {
  const [url, setUrl] = useState('');
  const [scanning, setScanning] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const { addScan } = useScan();

  async function handleScan(e) {
    e?.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) { setError('Please enter a URL to scan.'); return; }

    // Basic URL shape check
    const hasProto = /^https?:\/\//i.test(trimmed);
    const hasDomain = /[a-z0-9-]+\.[a-z]{2,}/i.test(trimmed);
    if (!hasDomain) { setError('Please enter a valid URL or domain (e.g., https://example.com).'); return; }

    setError('');
    setResult(null);
    setScanning(true);

    // Animate through steps
    for (let i = 0; i < SCAN_STEPS.length; i++) {
      setCurrentStep(i);
      await new Promise(r => setTimeout(r, 320 + Math.random() * 200));
    }

    const fullUrl = hasProto ? trimmed : 'https://' + trimmed;
    const scanResult = await simulateUrlAnalysis(fullUrl);
    scanResult.type = 'url';
    addScan(scanResult);
    setResult(scanResult);
    setScanning(false);
    setCurrentStep(-1);
  }

  function handleReset() {
    setUrl('');
    setResult(null);
    setError('');
    setCurrentStep(-1);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-teal-400 mb-1">
          <Link2 className="w-4.5 h-4.5" />
          <span className="text-xs font-semibold uppercase tracking-widest">URL Scanner</span>
        </div>
        <h2 className="text-xl font-bold text-white">Analyze a link before opening it</h2>
        <p className="text-sm text-slate-400 mt-1">Paste any URL below to check for phishing, brand impersonation, and malicious content.</p>
      </div>

      {/* Input card */}
      <div className="card p-5">
        <form onSubmit={handleScan} className="space-y-4">
          <div>
            <label htmlFor="url-input" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Website URL
            </label>
            <div className="relative">
              <input
                id="url-input"
                type="text"
                value={url}
                onChange={e => { setUrl(e.target.value); setError(''); }}
                placeholder="https://example.com/page"
                className="input-field pr-10 font-mono text-sm"
                disabled={scanning}
                autoComplete="off"
                spellCheck={false}
              />
              {url && !scanning && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  aria-label="Clear"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {error && (
              <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> {error}
              </p>
            )}
          </div>

          <div className="bg-amber-900/15 border border-amber-700/25 rounded-lg px-3 py-2">
            <p className="text-xs text-amber-400 flex items-start gap-1.5">
              <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" />
              Do not open the link directly to test it. ScamShield AI analyzes without loading the URL.
            </p>
          </div>

          <div className="flex gap-2">
            <button type="submit" disabled={scanning || !url.trim()} className="btn-primary flex-1 justify-center">
              {scanning ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing…</> : <><Search className="w-4 h-4" /> Analyze URL</>}
            </button>
            {(result || url) && !scanning && (
              <button type="button" onClick={handleReset} className="btn-secondary">
                <X className="w-4 h-4" /> Clear
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Example URLs */}
      {!scanning && !result && (
        <div className="card p-4">
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-3">Try an example</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {EXAMPLE_URLS.map(ex => (
              <button
                key={ex}
                onClick={() => setUrl(ex)}
                className="flex items-center gap-2 text-left p-2 rounded-lg bg-navy-700/40 hover:bg-navy-700 transition-colors group text-xs"
              >
                <ChevronRight className="w-3 h-3 text-teal-500 flex-shrink-0" />
                <span className="text-slate-300 font-mono truncate group-hover:text-teal-300 transition-colors">{ex}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Scan progress */}
      {scanning && (
        <div className="card p-5 animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <Loader2 className="w-4 h-4 text-teal-400 animate-spin" />
            <p className="text-sm font-semibold text-slate-300">Running analysis…</p>
          </div>
          <div className="space-y-2">
            {SCAN_STEPS.map((step, i) => (
              <div key={step.id} className="flex items-center gap-3">
                <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
                  {i < currentStep ? (
                    <CheckCircle className="w-4 h-4 text-teal-400" />
                  ) : i === currentStep ? (
                    <Loader2 className="w-3.5 h-3.5 text-teal-400 animate-spin" />
                  ) : (
                    <div className="w-3 h-3 rounded-full border border-slate-600" />
                  )}
                </div>
                <span className={`text-sm ${i <= currentStep ? 'text-slate-200' : 'text-slate-600'}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Result */}
      {result && !scanning && (
        <ScanResultCard result={result} onRescan={handleReset} />
      )}
    </div>
  );
}
