import clsx from 'clsx';
import { ShieldCheck, AlertTriangle, ShieldX, HelpCircle } from 'lucide-react';

const CONFIG = {
  safe: { label: 'Safe', icon: ShieldCheck, class: 'badge-safe' },
  suspicious: { label: 'Suspicious', icon: AlertTriangle, class: 'badge-suspicious' },
  malicious: { label: 'Malicious', icon: ShieldX, class: 'badge-malicious' },
  unknown: { label: 'Unknown', icon: HelpCircle, class: 'badge-unknown' },
};

export default function RiskBadge({ classification, size = 'sm' }) {
  const cfg = CONFIG[classification] ?? CONFIG.unknown;
  const Icon = cfg.icon;
  const iconSize = size === 'lg' ? 'w-4 h-4' : 'w-3 h-3';

  return (
    <span className={clsx(cfg.class, 'inline-flex items-center gap-1')}>
      <Icon className={iconSize} />
      {cfg.label}
    </span>
  );
}
