import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck, AlertTriangle, ShieldX, HelpCircle,
  Copy, Download, Flag, RotateCcw, ChevronDown, ChevronUp,
  CheckCircle, XCircle, AlertCircle, Info, ExternalLink
} from 'lucide-react';
import RiskBadge from './RiskBadge';
import RiskScoreGauge from './RiskScoreGauge';
import clsx from 'clsx';

const SEVERITY_ICON = {
  high: <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />,
  medium: <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />,
  low: <AlertCircle className="w-4 h-4 text-yellow-500 flex-shrink-0" />,
  info: <Info className="w-4 h-4 text-slate-400 flex-shrink-0" />,
};

const CHECK_ICON = {
  pass: <CheckCircle className="w-4 h-4 text-green-400" />,
  fail: <XCircle className="w-4 h-4 text-red-400" />,
  warn: <AlertCircle className="w-4 h-4 text-amber-400" />,
  demo: <Info className="w-4 h-4 text-slate-400" />,
};

const BANNER_CONFIG = {
  safe: { bg: 'bg-green-900/20 border-green-700/30', icon: ShieldCheck, iconColor: 'text-green-400', label: 'No significant threats detected' },
  suspicious: { bg: 'bg-amber-900/20 border-amber-700/30', icon: AlertTriangle, iconColor: 'text-amber-400', label: 'Exercise caution with this link' },
  malicious: { bg: 'bg-red-900/20 border-red-700/30', icon: ShieldX, iconColor: 'text-red-400', label: 'Do not open this link' },
  unknown: { bg: 'bg-slate-700/20 border-slate-600/30', icon: HelpCircle, iconColor: 'text-slate-400', label: 'Could not determine risk level' },
};

export default function ScanResultCard({ result, onRescan }) {
  const [copied, setCopied] = useState(false);
  const [showChecks, setShowChecks] = useState(false);
  const navigate = useNavigate();

  if (!result) return null;

  const cfg = BANNER_CONFIG[result.classification] ?? BANNER_CONFIG.unknown;
  const Icon = cfg.icon;

  function copyDetails() {
    const text = `ScamShield AI — Scan Report
URL: ${result.url}
Domain: ${result.domain}
Classification: ${result.classification.toUpperCase()}
Risk Score: ${result.score}/100
Scanned: ${new Date(result.scannedAt).toLocaleString()}
Indicators:
${result.indicators.map(i => `• ${i.text || i}`).join('\n')}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function exportJSON() {
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scamshield-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="animate-fade-in space-y-4">
      {/* Banner */}
      <div className={clsx('card border p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4', cfg.bg, cfg.border.replace('border-', 'border ').replace('border ', 'border-'))}>
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className={clsx('w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0', cfg.bg)}>
            <Icon className={clsx('w-6 h-6', cfg.iconColor)} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <RiskBadge classification={result.classification} />
              {result.isDemo && <span className="demo-badge">Demo result</span>}
            </div>
            <p className={clsx('text-base font-semibold', cfg.iconColor)}>{cfg.label}</p>
            <p className="text-xs text-slate-400 truncate mt-0.5">{result.url}</p>
          </div>
        </div>
        <RiskScoreGauge score={result.score} classification={result.classification} />
      </div>

      {/* URL details */}
      <div className="card p-4">
        <h3 className="text-sm font-semibold text-slate-300 mb-3">Analyzed URL</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <Detail label="Domain" value={result.domain} />
          <Detail label="Protocol" value={result.url.startsWith('https') ? 'HTTPS (Encrypted)' : 'HTTP (Unencrypted)'} />
          <Detail label="Scanned" value={new Date(result.scannedAt).toLocaleString()} />
          <Detail label="Model" value={result.modelVersion} />
          {result.confidence && <Detail label="Model Confidence" value={`${result.confidence}%`} />}
        </div>
        <div className="mt-3 p-2.5 bg-amber-900/20 border border-amber-700/30 rounded-lg">
          <p className="text-xs text-amber-400 flex items-start gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            <span>Do not open the original URL directly from this page. Always copy and review carefully.</span>
          </p>
        </div>
      </div>

      {/* Threat indicators */}
      <div className="card p-4">
        <h3 className="text-sm font-semibold text-slate-300 mb-3">Detection Evidence</h3>
        <div className="space-y-2">
          {result.indicators.map((ind, i) => {
            const indicator = typeof ind === 'string' ? { text: ind, severity: 'medium' } : ind;
            return (
              <div key={i} className="flex items-start gap-2.5 p-2.5 bg-navy-700/50 rounded-lg">
                {SEVERITY_ICON[indicator.severity] ?? SEVERITY_ICON.info}
                <p className="text-sm text-slate-300 leading-snug">{indicator.text}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Analysis checks */}
      {result.checks && (
        <div className="card overflow-hidden">
          <button
            className="w-full flex items-center justify-between p-4 text-sm font-semibold text-slate-300 hover:bg-navy-700/30 transition-colors"
            onClick={() => setShowChecks(v => !v)}
          >
            <span>Analysis Checks ({result.checks.length})</span>
            {showChecks ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
          </button>
          {showChecks && (
            <div className="border-t border-slate-700/50 divide-y divide-slate-700/30">
              {result.checks.map((check, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-2.5">
                  {CHECK_ICON[check.status] ?? CHECK_ICON.demo}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-300">{check.label}</p>
                    {check.detail && <p className="text-xs text-slate-500">{check.detail}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Recommendations */}
      {result.recommendations && (
        <div className="card p-4">
          <h3 className="text-sm font-semibold text-slate-300 mb-3">Recommendations</h3>
          <ul className="space-y-2">
            {result.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                <span className="text-teal-400 mt-0.5">•</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <button onClick={copyDetails} className="btn-secondary text-sm">
          <Copy className="w-3.5 h-3.5" />
          {copied ? 'Copied!' : 'Copy Report'}
        </button>
        <button onClick={exportJSON} className="btn-secondary text-sm">
          <Download className="w-3.5 h-3.5" />
          Export JSON
        </button>
        {onRescan && (
          <button onClick={onRescan} className="btn-secondary text-sm">
            <RotateCcw className="w-3.5 h-3.5" />
            Scan Another
          </button>
        )}
        <button className="btn-ghost text-sm text-red-400">
          <Flag className="w-3.5 h-3.5" />
          Report
        </button>
      </div>

      {/* HTTPS disclaimer */}
      <p className="text-xs text-slate-600 italic">
        Note: HTTPS indicates an encrypted connection but does not confirm a site is legitimate. 
        Demo results are generated locally — connect the ML API for real analysis.
      </p>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-xs text-slate-500 mb-0.5">{label}</p>
      <p className="text-sm text-slate-200 font-medium break-all">{value}</p>
    </div>
  );
}
