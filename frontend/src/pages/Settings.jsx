import { useState } from 'react';
import { User, Bell, Shield, Database, Trash2, LogOut, ChevronRight, CheckCircle, Info } from 'lucide-react';

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [retention, setRetention] = useState('30');
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-white">Settings</h2>
        <p className="text-sm text-slate-400 mt-1">Preferences, privacy, and account options.</p>
      </div>

      {/* Profile */}
      <Section title="Profile" icon={<User className="w-4 h-4" />}>
        <div className="flex items-center gap-4 p-4 border-b border-slate-700/50">
          <div className="w-12 h-12 rounded-full bg-teal-600/30 border border-teal-500/40 flex items-center justify-center text-teal-400 text-lg font-bold">
            D
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Demo User</p>
            <p className="text-xs text-slate-400">demo@scamshield.ai</p>
            <span className="demo-badge mt-1 inline-flex">Mock account</span>
          </div>
        </div>
        <div className="p-4 space-y-3">
          <Field label="Display Name" defaultValue="Demo User" />
          <Field label="Email" defaultValue="demo@scamshield.ai" type="email" />
        </div>
      </Section>

      {/* Notifications */}
      <Section title="Notifications" icon={<Bell className="w-4 h-4" />}>
        <div className="p-4 space-y-3">
          <Toggle
            label="Scan result notifications"
            desc="Get notified when a scan detects malicious content."
            checked={notifications}
            onChange={setNotifications}
          />
        </div>
      </Section>

      {/* Privacy & Data */}
      <Section title="Privacy & Data" icon={<Database className="w-4 h-4" />}>
        <div className="p-4 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Scan history retention</label>
            <select
              value={retention}
              onChange={e => setRetention(e.target.value)}
              className="bg-navy-700 border border-slate-600 text-slate-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-teal-500 w-full"
            >
              <option value="7">7 days</option>
              <option value="30">30 days</option>
              <option value="90">90 days</option>
              <option value="forever">Keep indefinitely</option>
            </select>
          </div>
          <div className="flex items-start gap-2 text-xs text-slate-500 bg-navy-700/30 rounded-lg p-3">
            <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-slate-400" />
            <p>Scan history is stored locally in your browser. No data is sent to external servers in demo mode.</p>
          </div>
        </div>
      </Section>

      {/* Connected services */}
      <Section title="Connected Services" icon={<Shield className="w-4 h-4" />}>
        <div className="p-4 space-y-3">
          {[
            { name: 'ML Detection API', status: 'Not connected', color: 'text-slate-500' },
            { name: 'Threat Intelligence Feed', status: 'Demo mode', color: 'text-amber-400' },
            { name: 'VirusTotal API', status: 'Not configured', color: 'text-slate-500' },
          ].map(s => (
            <div key={s.name} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm text-slate-300">{s.name}</p>
                <p className={`text-xs ${s.color}`}>{s.status}</p>
              </div>
              <button className="btn-ghost text-xs text-teal-400">Configure <ChevronRight className="w-3 h-3" /></button>
            </div>
          ))}
        </div>
      </Section>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <button onClick={handleSave} className="btn-primary justify-center">
          {saved ? <><CheckCircle className="w-4 h-4" /> Saved!</> : 'Save Changes'}
        </button>
        <button className="btn-ghost text-sm text-red-400 justify-center">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700/50 text-slate-300">
        {icon}
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Field({ label, defaultValue, type = 'text' }) {
  return (
    <div>
      <label className="text-xs text-slate-500 block mb-1">{label}</label>
      <input
        type={type}
        defaultValue={defaultValue}
        className="input-field text-sm"
      />
    </div>
  );
}

function Toggle({ label, desc, checked, onChange }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm text-slate-300">{label}</p>
        <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${checked ? 'bg-teal-600' : 'bg-slate-700'}`}
        role="switch"
        aria-checked={checked}
      >
        <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  );
}
