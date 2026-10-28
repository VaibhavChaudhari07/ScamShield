// Mock data — clearly labeled demo data for UI demonstration
// Replace with real API responses when backend is ready

export const DEMO_SCAN_HISTORY = [
  {
    id: 'scan_001',
    type: 'url',
    input: 'https://paypal-secure-verify.net/account/confirm',
    domain: 'paypal-secure-verify.net',
    classification: 'malicious',
    score: 91,
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    indicators: ['Brand impersonation detected', 'Suspicious subdomain pattern', 'Recently registered domain'],
  },
  {
    id: 'scan_002',
    type: 'qr',
    input: 'https://upi://pay?pa=unknown-9812@ybl&pn=FreeRecharge&am=1&cu=INR',
    domain: 'UPI Payment QR',
    classification: 'suspicious',
    score: 67,
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    indicators: ['Unverified UPI recipient', 'Preset amount in QR code'],
  },
  {
    id: 'scan_003',
    type: 'url',
    input: 'https://github.com/torvalds/linux',
    domain: 'github.com',
    classification: 'safe',
    score: 4,
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    indicators: [],
  },
  {
    id: 'scan_004',
    type: 'sms',
    input: 'Dear customer, your KYC expires today. Click https://sbi-kyc-now.xyz to update.',
    domain: 'sbi-kyc-now.xyz',
    classification: 'malicious',
    score: 88,
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    indicators: ['Urgency language', 'Suspicious domain', 'Bank impersonation'],
  },
  {
    id: 'scan_005',
    type: 'url',
    input: 'https://www.amazon.in/dp/B09XVKJMQ3',
    domain: 'amazon.in',
    classification: 'safe',
    score: 6,
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    indicators: [],
  },
  {
    id: 'scan_006',
    type: 'url',
    input: 'http://bit.ly/3qWs9Pp',
    domain: 'bit.ly',
    classification: 'suspicious',
    score: 52,
    timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    indicators: ['URL shortener — destination unknown', 'HTTP (no TLS)'],
  },
  {
    id: 'scan_007',
    type: 'qr',
    input: 'https://docs.google.com/forms/d/e/1FAIpQLSf_example/viewform',
    domain: 'docs.google.com',
    classification: 'safe',
    score: 11,
    timestamp: new Date(Date.now() - 1000 * 60 * 400).toISOString(),
    indicators: [],
  },
  {
    id: 'scan_008',
    type: 'url',
    input: 'https://hdfc-netbanklng.in/login',
    domain: 'hdfc-netbanklng.in',
    classification: 'malicious',
    score: 95,
    timestamp: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
    indicators: ['Typosquatting: HDFC Bank', 'Credential harvest page pattern', 'Login page on unofficial domain'],
  },
];

export const DEMO_DASHBOARD_STATS = {
  totalScans: 1284,
  safe: 891,
  suspicious: 247,
  malicious: 146,
  urlScans: 834,
  qrScans: 312,
  smsScans: 138,
};

export const DEMO_SCAN_TREND = [
  { date: 'Oct 22', scans: 38, malicious: 5 },
  { date: 'Oct 23', scans: 52, malicious: 8 },
  { date: 'Oct 24', scans: 41, malicious: 4 },
  { date: 'Oct 25', scans: 67, malicious: 12 },
  { date: 'Oct 26', scans: 55, malicious: 7 },
  { date: 'Oct 27', scans: 73, malicious: 15 },
  { date: 'Oct 28', scans: 48, malicious: 6 },
];

export const DEMO_THREAT_FEED = [
  { domain: 'paypal-secure-login.tk', type: 'Phishing', reports: 34, severity: 'critical' },
  { domain: 'amazon-refund-claims.net', type: 'Scam page', reports: 28, severity: 'high' },
  { domain: 'sbi-kyc-update.xyz', type: 'Bank impersonation', reports: 21, severity: 'high' },
  { domain: 'free-iphone15-winner.com', type: 'Prize scam', reports: 15, severity: 'medium' },
];

export const RISK_COLORS = {
  safe: '#4ade80',
  suspicious: '#fbbf24',
  malicious: '#f87171',
  unknown: '#94a3b8',
};

export const CLASSIFICATION_CONFIG = {
  safe: {
    label: 'Safe',
    color: 'text-green-400',
    bg: 'bg-green-900/30',
    border: 'border-green-700/40',
    icon: '✓',
  },
  suspicious: {
    label: 'Suspicious',
    color: 'text-amber-400',
    bg: 'bg-amber-900/30',
    border: 'border-amber-700/40',
    icon: '⚠',
  },
  malicious: {
    label: 'Malicious',
    color: 'text-red-400',
    bg: 'bg-red-900/30',
    border: 'border-red-700/40',
    icon: '✕',
  },
  unknown: {
    label: 'Unknown',
    color: 'text-slate-400',
    bg: 'bg-slate-700/30',
    border: 'border-slate-600/40',
    icon: '?',
  },
};

// Simulated URL analysis — replace with real ML API call
export function simulateUrlAnalysis(url) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const lower = url.toLowerCase();
      let score = 10;
      const indicators = [];
      const checks = [];

      // Domain parsing
      let domain = '';
      try {
        domain = new URL(url.startsWith('http') ? url : 'https://' + url).hostname;
      } catch {
        domain = url;
      }

      checks.push({ label: 'URL syntax validation', status: 'pass' });
      checks.push({ label: 'Domain extraction', status: 'pass', detail: domain });

      // HTTPS check
      if (!url.startsWith('https://')) {
        score += 15;
        indicators.push({ text: 'Connection is not encrypted (HTTP)', severity: 'medium' });
        checks.push({ label: 'TLS / HTTPS', status: 'fail', detail: 'HTTP only' });
      } else {
        checks.push({ label: 'TLS / HTTPS', status: 'pass', detail: 'Encrypted connection' });
      }

      // Brand impersonation patterns
      const brands = ['paypal', 'amazon', 'google', 'facebook', 'apple', 'microsoft', 'netflix', 'hdfc', 'sbi', 'icici', 'paytm'];
      const suspiciousTLDs = ['.tk', '.xyz', '.top', '.click', '.cf', '.ga', '.ml', '.gq'];
      const matchedBrand = brands.find(b => lower.includes(b) && !lower.includes(`${b}.com`) && !lower.includes(`${b}.in`) && !lower.includes(`www.${b}`));

      if (matchedBrand) {
        score += 35;
        indicators.push({ text: `Possible brand impersonation: ${matchedBrand.toUpperCase()}`, severity: 'high' });
        checks.push({ label: 'Brand impersonation check', status: 'warn', detail: `"${matchedBrand}" in domain` });
      } else {
        checks.push({ label: 'Brand impersonation check', status: 'pass' });
      }

      // Suspicious TLD
      const badTld = suspiciousTLDs.find(t => domain.endsWith(t));
      if (badTld) {
        score += 20;
        indicators.push({ text: `High-risk TLD: ${badTld}`, severity: 'medium' });
        checks.push({ label: 'TLD reputation', status: 'warn', detail: badTld + ' is commonly abused' });
      } else {
        checks.push({ label: 'TLD reputation', status: 'pass' });
      }

      // Suspicious keywords
      const scamWords = ['login', 'verify', 'secure', 'update', 'confirm', 'kyc', 'account', 'free', 'winner', 'prize'];
      const foundWords = scamWords.filter(w => lower.includes(w));
      if (foundWords.length >= 2) {
        score += 15;
        indicators.push({ text: `Suspicious keywords in path: ${foundWords.slice(0, 3).join(', ')}`, severity: 'medium' });
      }
      checks.push({ label: 'Keyword analysis', status: foundWords.length >= 2 ? 'warn' : 'pass', detail: foundWords.length > 0 ? foundWords.join(', ') : 'None found' });

      // URL shortener
      const shorteners = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'short.io'];
      if (shorteners.some(s => domain.includes(s))) {
        score += 15;
        indicators.push({ text: 'URL shortener detected — destination is unknown', severity: 'medium' });
        checks.push({ label: 'URL shortener detection', status: 'warn' });
      } else {
        checks.push({ label: 'URL shortener detection', status: 'pass' });
      }

      // IP address instead of domain
      if (/\d+\.\d+\.\d+\.\d+/.test(domain)) {
        score += 25;
        indicators.push({ text: 'Raw IP address used instead of domain name', severity: 'high' });
      }

      // Subdomains
      const parts = domain.split('.');
      if (parts.length > 3) {
        score += 10;
        indicators.push({ text: 'Excessive subdomain depth — could be evasion attempt', severity: 'low' });
      }

      // Threat intelligence (simulated)
      checks.push({ label: 'Threat intelligence lookup', status: 'demo', detail: 'Demo mode — real lookup unavailable' });

      score = Math.min(100, Math.max(1, score + Math.floor(Math.random() * 6)));

      let classification;
      if (score >= 70) classification = 'malicious';
      else if (score >= 35) classification = 'suspicious';
      else classification = 'safe';

      resolve({
        url,
        domain,
        classification,
        score,
        indicators: indicators.length > 0 ? indicators : [{ text: 'No significant threat indicators detected', severity: 'info' }],
        checks,
        isDemo: true,
        modelVersion: 'ScamShield-v0.1-demo',
        confidence: Math.floor(60 + Math.random() * 30),
        scannedAt: new Date().toISOString(),
        recommendations: getRecommendations(classification),
      });
    }, 2000 + Math.random() * 1000);
  });
}

function getRecommendations(classification) {
  if (classification === 'malicious') {
    return [
      'Do not open this link under any circumstances.',
      'If you already visited it, change your passwords immediately.',
      'Report this URL to your bank if it impersonates a financial institution.',
      'Warn others who may have received this link.',
    ];
  }
  if (classification === 'suspicious') {
    return [
      'Exercise caution before opening this link.',
      'Verify the sender or source independently.',
      'Check the domain name carefully for subtle misspellings.',
      'Avoid entering credentials or personal information.',
    ];
  }
  return [
    'No significant threats detected.',
    'Always verify the source before entering sensitive information.',
    'Keep your browser and antivirus updated.',
  ];
}
