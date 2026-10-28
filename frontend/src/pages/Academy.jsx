import { BookOpen, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

const MODULES = [
  {
    emoji: '🎣',
    title: 'How phishing URLs work',
    summary: 'Attackers create convincing fake websites to steal your credentials.',
    content: [
      'Phishing URLs are designed to look identical to legitimate websites — same layout, logo, and colors. The only difference is the domain name.',
      'Common techniques include: typosquatting (paypa1.com instead of paypal.com), subdomain attacks (paypal.secure-login.xyz), and homograph attacks using Unicode characters that look like Latin letters.',
      'HTTPS does not indicate safety — attackers routinely obtain free TLS certificates for phishing sites. Always check the full domain name.',
      'Watch for: URL shorteners hiding the real destination, excessive subdomains, recently registered domains, and domains with urgency keywords like "verify", "secure", "confirm".',
    ],
  },
  {
    emoji: '📱',
    title: 'How QR code scams work',
    summary: 'A QR code is just a URL — it can point anywhere, including phishing sites.',
    content: [
      'QR codes encode data (usually a URL) that your phone camera opens automatically. You cannot verify a QR code\'s destination without scanning it first — which is exactly what attackers exploit.',
      'Physical QR code fraud: attackers print fake QR stickers and paste them over legitimate codes on parking meters, restaurant menus, or posters.',
      'Payment QR scams: UPI QR codes can encode a preset payment amount and recipient. Fraudsters ask victims to "scan to receive money" — but the QR is designed to make you send money instead.',
      'Always review the decoded URL before opening it. Use a QR scanner like ScamShield AI that shows the destination first.',
    ],
  },
  {
    emoji: '💳',
    title: 'Recognizing fake payment requests',
    summary: 'Urgency, pressure, and unusual UPI IDs are common warning signs.',
    content: [
      'Legitimate payment requests never require you to enter your UPI PIN, password, or OTP to "receive" money. You only need your PIN to send money.',
      'Red flags: preset amounts in QR codes, urgency ("pay in 10 minutes or lose your booking"), requests to scan a QR to receive a refund or prize.',
      'Verify the UPI ID recipient name carefully before paying. Names can be misleading — always verify through official channels.',
      'Report suspicious UPI fraud to your bank and at cybercrime.gov.in immediately.',
    ],
  },
  {
    emoji: '🔤',
    title: 'Look-alike domains and typosquatting',
    summary: 'One wrong letter in a domain can lead you to a phishing site.',
    content: [
      'Typosquatting registers domains with common typos: gooogle.com, amzon.in, paytm-wallet.com. Attackers count on hurried users not noticing.',
      'Homograph attacks use Unicode characters that resemble Latin letters — for example, a Cyrillic "а" looks identical to a Latin "a" but has a different code point. The domain looks correct but is entirely different.',
      'Combosquatting adds trusted words around a brand: secure-paypal.net, amazon-support-india.com. The brand name is present but not in the official domain.',
      'Always check the root domain (the part just before .com/.in). Anything before that is a subdomain controlled by whoever owns the root.',
    ],
  },
  {
    emoji: '⚠️',
    title: 'What to do after clicking a suspicious link',
    summary: 'Quick action after exposure can limit the damage significantly.',
    content: [
      '1. Do not enter any information on the page. Close it immediately.',
      '2. If you entered any credentials: change your password immediately on the legitimate site, and change it on any other site where you use the same password.',
      '3. Enable two-factor authentication (2FA) on your accounts if not already done.',
      '4. If you entered payment card details: call your bank immediately to block the card.',
      '5. Check for any unauthorized access in your email, banking, and social accounts.',
      '6. Run a malware scan if you downloaded anything from the page.',
      '7. Report the incident to your bank and to cybercrime.gov.in.',
    ],
  },
  {
    emoji: '🇮🇳',
    title: 'How to report online fraud in India',
    summary: 'Know the official channels for reporting cybercrime in India.',
    content: [
      'National Cyber Crime Reporting Portal: cybercrime.gov.in — file a complaint online for financial fraud, phishing, social media crimes, and more.',
      'National Cyber Crime Helpline: 1930 — available for financial cyber fraud.',
      'Your bank: report unauthorized transactions immediately. Banks have a limited window to reverse fraud transactions.',
      'RBI Ombudsman: for banking grievances not resolved by your bank.',
      'Google Safe Browsing: report phishing sites at safebrowsing.google.com/safebrowsing/report_phish/',
      'PhishTank: submit phishing URLs at phishtank.org',
    ],
  },
];

export default function Academy() {
  const [open, setOpen] = useState(null);

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <div className="flex items-center gap-2 text-teal-400 mb-1">
          <BookOpen className="w-4.5 h-4.5" />
          <span className="text-xs font-semibold uppercase tracking-widest">Security Academy</span>
        </div>
        <h2 className="text-xl font-bold text-white">Stay aware, stay safe</h2>
        <p className="text-sm text-slate-400 mt-1">Practical guides to recognizing and avoiding digital scams.</p>
      </div>

      <div className="space-y-3">
        {MODULES.map((mod, i) => (
          <div key={i} className="card overflow-hidden">
            <button
              className="w-full flex items-center gap-4 p-4 hover:bg-navy-700/30 transition-colors text-left"
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
            >
              <span className="text-2xl flex-shrink-0">{mod.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{mod.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{mod.summary}</p>
              </div>
              {open === i
                ? <ChevronUp className="w-4 h-4 text-slate-500 flex-shrink-0" />
                : <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />}
            </button>
            {open === i && (
              <div className="border-t border-slate-700/50 px-5 py-4 space-y-3 bg-navy-800/40 animate-fade-in">
                {mod.content.map((para, j) => (
                  <p key={j} className="text-sm text-slate-400 leading-relaxed">{para}</p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Resources */}
      <div className="card p-4">
        <h3 className="text-sm font-semibold text-slate-300 mb-3">External Resources</h3>
        <div className="space-y-2">
          {[
            { label: 'National Cyber Crime Portal (India)', url: 'https://cybercrime.gov.in' },
            { label: 'Google Safe Browsing Report', url: 'https://safebrowsing.google.com/safebrowsing/report_phish/' },
            { label: 'PhishTank — Submit Phishing URLs', url: 'https://phishtank.org' },
            { label: 'CERT-In — Indian Cybersecurity Agency', url: 'https://www.cert-in.org.in' },
          ].map(r => (
            <a
              key={r.url}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-teal-400 hover:text-teal-300 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
              {r.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
