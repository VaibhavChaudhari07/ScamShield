import { createContext, useContext, useState, useEffect } from 'react';
import { DEMO_SCAN_HISTORY } from '../data/mockData';

const ScanContext = createContext(null);

export function ScanProvider({ children }) {
  const [scanHistory, setScanHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('scamshield_history');
      return saved ? JSON.parse(saved) : DEMO_SCAN_HISTORY;
    } catch {
      return DEMO_SCAN_HISTORY;
    }
  });

  const [lastResult, setLastResult] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('scamshield_history', JSON.stringify(scanHistory));
    } catch { /* storage unavailable */ }
  }, [scanHistory]);

  function addScan(result) {
    const entry = {
      id: `scan_${Date.now()}`,
      type: result.type || 'url',
      input: result.url || result.input,
      domain: result.domain,
      classification: result.classification,
      score: result.score,
      timestamp: new Date().toISOString(),
      indicators: result.indicators?.map(i => i.text || i) ?? [],
      fullResult: result,
    };
    setScanHistory(prev => [entry, ...prev.slice(0, 99)]);
    setLastResult(entry);
    return entry;
  }

  function deleteScan(id) {
    setScanHistory(prev => prev.filter(s => s.id !== id));
  }

  function clearHistory() {
    setScanHistory([]);
  }

  return (
    <ScanContext.Provider value={{ scanHistory, lastResult, addScan, deleteScan, clearHistory }}>
      {children}
    </ScanContext.Provider>
  );
}

export function useScan() {
  const ctx = useContext(ScanContext);
  if (!ctx) throw new Error('useScan must be used within ScanProvider');
  return ctx;
}
