import { Link } from 'react-router-dom';
import {
  ShieldCheck, Link2, QrCode, Cpu, ArrowRight,
  ChevronRight, AlertTriangle, Globe, Lock, CheckCircle,
  MessageSquare, BarChart2, ShieldX
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 font-sans">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-slate-700/50 bg-navy-900/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-teal-600/20 border border-teal-500/40 rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-4.5 h-4.5 text-teal-400" />
            </div>
            <span className="font-bold text-white">ScamShield <span className="text-teal-400">AI</span></span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-slate-400">
            <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
            <a href="#academy" className="hover:text-white transition-colors">Academy</a>
          </div>
          <Link to="/dashboard" className="btn-primary text-sm py-2 px-4">
            Open App <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-24 px-4">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-teal-500/5 rounded-full blur-3xl" />
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 rounded-full px-4 py-1.5 text-sm text-teal-400 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            AI-Powered Cybersecurity Protection
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Scan before<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400">you trust.</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            ScamShield AI detects phishing URLs, malicious QR codes, and SMS scams in seconds — 
            powered by machine learning trained on real-world threats.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/url-scanner" className="btn-primary text-base px-6 py-3 justify-center">
              <Link2 className="w-4.5 h-4.5" />
              Scan a URL
            </Link>
            <Link to="/qr-scanner" className="btn-secondary text-base px-6 py-3 justify-center">
              <QrCode className="w-4.5 h-4.5" />
              Scan a QR Code
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-slate-700/50 bg-navy-900/50 py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-xs text-amber-400 font-semibold mb-4 flex items-center justify-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" /> Demo statistics — not real user data
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            {[
              { label: 'Total Scans', value: '1,284', sub: 'in demo dataset' },
              { label: 'Threats Blocked', value: '146', sub: 'malicious URLs/QRs' },
              { label: 'Users Protected', value: '—', sub: 'connect backend' },
              { label: 'Detection Types', value: '3', sub: 'URL, QR, SMS' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold text-teal-400">{stat.value}</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">{stat.label}</p>
                <p className="text-xs text-slate-600">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">Three layers of protection</h2>
            <p className="text-slate-400">Comprehensive analysis across the most common digital attack vectors.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Link2 className="w-6 h-6 text-teal-400" />}
              title="URL Protection"
              desc="Analyze any link before opening it. Detects phishing pages, brand impersonation, suspicious domains, and redirect chains."
              to="/url-scanner"
            />
            <FeatureCard
              icon={<QrCode className="w-6 h-6 text-teal-400" />}
              title="QR Safety"
              desc="Upload or scan QR codes to decode and verify the destination. Supports URLs, UPI payment QRs, Wi-Fi configs, and more."
              to="/qr-scanner"
            />
            <FeatureCard
              icon={<Cpu className="w-6 h-6 text-teal-400" />}
              title="AI Risk Analysis"
              desc="Machine learning models score every scan for risk. Explains what was detected and why — not just a red/green label."
              to="/dashboard"
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-16 px-4 bg-navy-900/40 border-y border-slate-700/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">How it works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { step: '01', icon: <Link2 />, title: 'Input', desc: 'Paste a URL, upload a QR image, or paste a suspicious message.' },
              { step: '02', icon: <Cpu />, title: 'Analyze', desc: 'Our AI checks domains, keywords, patterns, and threat databases.' },
              { step: '03', icon: <ShieldCheck />, title: 'Understand Risk', desc: 'See a risk score, what was detected, and clear recommendations.' },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-14 h-14 mx-auto bg-teal-600/15 border border-teal-500/25 rounded-2xl flex items-center justify-center text-teal-400 mb-4">
                  {icon}
                </div>
                <p className="text-xs text-teal-500 font-bold tracking-widest mb-1">{step}</p>
                <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awareness section */}
      <section id="academy" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-3">Stay aware, stay safe</h2>
            <p className="text-slate-400">Understanding threats is the first step to avoiding them.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {AWARENESS_CARDS.map((card) => (
              <Link key={card.title} to="/academy" className="card p-4 hover:border-teal-600/40 hover:bg-navy-700/50 transition-all duration-200 group">
                <div className="text-2xl mb-3">{card.emoji}</div>
                <h3 className="text-sm font-semibold text-white mb-1 group-hover:text-teal-400 transition-colors">{card.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{card.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-b from-navy-900/0 to-navy-900/60">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 mx-auto bg-teal-600/20 border border-teal-500/30 rounded-2xl flex items-center justify-center mb-6">
            <ShieldCheck className="w-8 h-8 text-teal-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Ready to scan?</h2>
          <p className="text-slate-400 mb-8">Open the dashboard to start analyzing URLs and QR codes.</p>
          <Link to="/dashboard" className="btn-primary text-base px-8 py-3 mx-auto justify-center inline-flex">
            Open Dashboard <ArrowRight className="w-4.5 h-4.5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 bg-navy-900 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span className="text-sm font-semibold text-slate-300">ScamShield AI</span>
              <span className="text-slate-600 text-xs">— Academic project demo</span>
            </div>
            <div className="flex gap-5 text-xs text-slate-500">
              <Link to="/academy" className="hover:text-slate-300 transition-colors">Security Academy</Link>
              <a href="#features" className="hover:text-slate-300 transition-colors">Privacy</a>
              <a href="#features" className="hover:text-slate-300 transition-colors">About</a>
              <a href="#features" className="hover:text-slate-300 transition-colors">Disclaimer</a>
            </div>
          </div>
          <p className="text-xs text-slate-700 text-center mt-4">
            Disclaimer: ScamShield AI is a demonstration project. Demo results are generated locally and should not be used as a sole basis for security decisions. 
            Connect a verified threat intelligence backend for production use.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc, to }) {
  return (
    <Link to={to} className="card p-6 hover:border-teal-600/40 hover:bg-navy-700/40 transition-all duration-200 group block">
      <div className="w-12 h-12 bg-teal-600/15 border border-teal-500/25 rounded-xl flex items-center justify-center mb-4 group-hover:bg-teal-600/25 transition-colors">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-white mb-2 group-hover:text-teal-400 transition-colors">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
      <div className="flex items-center gap-1 text-xs text-teal-500 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
        Try it <ChevronRight className="w-3 h-3" />
      </div>
    </Link>
  );
}

const AWARENESS_CARDS = [
  { emoji: '🎣', title: 'How phishing URLs work', desc: 'Attackers craft domains that look like real brands to steal credentials or install malware.' },
  { emoji: '📱', title: 'QR code scams', desc: 'Fake QR codes redirect to phishing sites or trigger unauthorized UPI payments.' },
  { emoji: '💳', title: 'Fake payment requests', desc: 'Fraudsters embed preset amounts in payment QRs and use urgency to pressure victims.' },
  { emoji: '🔤', title: 'Look-alike domains', desc: 'Typosquatting and homograph attacks use near-identical characters to fool users.' },
  { emoji: '⚠️', title: 'After clicking a bad link', desc: 'Change passwords, enable 2FA, check app permissions, and report to your bank immediately.' },
  { emoji: '🇮🇳', title: 'Report fraud in India', desc: 'File a complaint at cybercrime.gov.in or call the National Cyber Crime Helpline: 1930.' },
];
