import { useState } from 'react';
import { Link2, QrCode, MessageSquare, Trash2, Search, Filter, Clock, ChevronDown, ChevronRight, Download, AlertTriangle } from 'lucide-react';
import { useScan } from '../context/ScanContext';
import RiskBadge from '../components/shared/RiskBadge';
import { formatDateTime } from '../utils/dateUtils';
import clsx from 'clsx';

const CLASSIFICATIONS = ['all', 'safe', 'suspicious', 'malicious', 'unknown'];
const TYPES = ['all', 'url', 'qr', 'sms'];
const TYPE_ICONS = {
  url: <Link2 className="w-3.5 h-3.5" />,
  qr: <QrCode className="w-3.5 h-3.5" />,
  sms: <MessageSquare className="w-3.5 h-3.5" />,
};

export default function ScanHistory() {
  const { scanHistory, deleteScan, clearHistory } = useScan();
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [expanded, setExpanded] = useState(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  let filtered = scanHistory.filter(s => {
    if (classFilter !== 'all' && s.classification !== classFilter) return false;
    if (typeFilter !== 'all' && s.type !== typeFilter) return false;
    if (search && !s.input.toLowerCase().includes(search.toLowerCase()) && !s.domain?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (sortBy === 'newest') filtered = filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  else if (sortBy === 'oldest') filtered = filtered.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  else if (sortBy === 'score-high') filtered = filtered.sort((a, b) => b.score - a.score);
  else if (sortBy === 'score-low') filtered = filtered.sort((a, b) => a.score - b.score);

  const total = filtered.length;
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil(total / PER_PAGE);

  function exportCSV() {
    const rows = [
      ['ID', 'Type', 'Input', 'Domain', 'Classification', 'Score', 'Timestamp'],
      ...filtered.map(s => [s.id, s.type, `"${s.input}"`, s.domain || '', s.classification, s.score, s.timestamp]),
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scamshield-history-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white">Scan History</h2>
          <p className="text-sm text-slate-400 mt-0.5">{total} record{total !== 1 ? 's' : ''} found</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="btn-secondary text-sm">
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
          {scanHistory.length > 0 && (
            <button
              onClick={() => { if (window.confirm('Clear all scan history?')) clearHistory(); }}
              className="btn-ghost text-sm text-red-400 hover:text-red-300"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by URL or domain…"
            className="input-field pl-9 text-sm"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <FilterSelect value={classFilter} onChange={v => { setClassFilter(v); setPage(1); }} options={CLASSIFICATIONS} label="Risk" />
          <FilterSelect value={typeFilter} onChange={v => { setTypeFilter(v); setPage(1); }} options={TYPES} label="Type" />
          <FilterSelect value={sortBy} onChange={setSortBy} options={['newest', 'oldest', 'score-high', 'score-low']} label="Sort" />
        </div>
      </div>

      {/* Results */}
      {paged.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-slate-500 text-sm">No scans match your filters.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {paged.map((scan) => (
            <div key={scan.id} className="card overflow-hidden">
              <button
                className="w-full flex items-center gap-3 p-3.5 hover:bg-navy-700/30 transition-colors text-left"
                onClick={() => setExpanded(expanded === scan.id ? null : scan.id)}
              >
                <div className="w-8 h-8 bg-navy-700 rounded-lg flex items-center justify-center flex-shrink-0 text-slate-400">
                  {TYPE_ICONS[scan.type] ?? <Link2 className="w-3.5 h-3.5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-200 truncate font-mono text-xs">{scan.input}</p>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    {formatDateTime(scan.timestamp)}
                    {scan.domain && <><span className="text-slate-700">·</span>{scan.domain}</>}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={clsx(
                    'text-xs font-bold',
                    scan.score >= 70 ? 'text-red-400' : scan.score >= 35 ? 'text-amber-400' : 'text-green-400'
                  )}>{scan.score}</span>
                  <RiskBadge classification={scan.classification} />
                  {expanded === scan.id ? <ChevronDown className="w-3.5 h-3.5 text-slate-500" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
                </div>
              </button>

              {expanded === scan.id && (
                <div className="border-t border-slate-700/50 p-4 bg-navy-800/50 animate-fade-in space-y-3">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Full input</p>
                    <p className="text-xs font-mono text-slate-300 break-all bg-navy-700 rounded px-2 py-1.5">{scan.input}</p>
                  </div>
                  {scan.indicators?.length > 0 && (
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Indicators</p>
                      <ul className="space-y-1">
                        {scan.indicators.slice(0, 4).map((ind, i) => (
                          <li key={i} className="text-xs text-slate-400 flex items-start gap-1.5">
                            <AlertTriangle className="w-3 h-3 text-amber-500 flex-shrink-0 mt-0.5" />
                            {typeof ind === 'string' ? ind : ind.text}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => deleteScan(scan.id)}
                      className="btn-ghost text-xs text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn-secondary text-sm py-2 px-3 disabled:opacity-40">Previous</button>
          <span className="text-xs text-slate-400">{page} / {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="btn-secondary text-sm py-2 px-3 disabled:opacity-40">Next</button>
        </div>
      )}
    </div>
  );
}

function FilterSelect({ value, onChange, options, label }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="bg-navy-700 border border-slate-600 text-slate-300 text-xs rounded-lg px-3 py-2 pr-7 focus:outline-none focus:border-teal-500 appearance-none capitalize"
      >
        {options.map(o => (
          <option key={o} value={o} className="capitalize">{o}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500 pointer-events-none" />
    </div>
  );
}
