import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ScanProvider } from './context/ScanContext';
import AppLayout from './components/layout/AppLayout';

// Eagerly load the landing page and the two primary scanner pages
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import UrlScanner from './pages/UrlScanner';
import QrScanner from './pages/QrScanner';

// Lazy-load everything else — loaded on first navigation, not on initial page load
const SmsScanner     = lazy(() => import('./pages/SmsScanner'));
const ScanHistory    = lazy(() => import('./pages/ScanHistory'));
const ThreatReports  = lazy(() => import('./pages/ThreatReports'));
const Analytics      = lazy(() => import('./pages/Analytics'));
const Academy        = lazy(() => import('./pages/Academy'));
const Settings       = lazy(() => import('./pages/Settings'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-48 text-slate-500 text-sm">
      <span className="animate-pulse">Loading…</span>
    </div>
  );
}

export default function App() {
  return (
    <ScanProvider>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Landing page — no sidebar */}
          <Route path="/" element={<LandingPage />} />

          {/* App shell with sidebar */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/url-scanner" element={<UrlScanner />} />
            <Route path="/qr-scanner" element={<QrScanner />} />
            <Route path="/sms-scanner" element={<Suspense fallback={<PageLoader />}><SmsScanner /></Suspense>} />
            <Route path="/history"     element={<Suspense fallback={<PageLoader />}><ScanHistory /></Suspense>} />
            <Route path="/threats"     element={<Suspense fallback={<PageLoader />}><ThreatReports /></Suspense>} />
            <Route path="/analytics"   element={<Suspense fallback={<PageLoader />}><Analytics /></Suspense>} />
            <Route path="/academy"     element={<Suspense fallback={<PageLoader />}><Academy /></Suspense>} />
            <Route path="/settings"    element={<Suspense fallback={<PageLoader />}><Settings /></Suspense>} />
            <Route path="/admin"       element={<Suspense fallback={<PageLoader />}><AdminDashboard /></Suspense>} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </ScanProvider>
  );
}
