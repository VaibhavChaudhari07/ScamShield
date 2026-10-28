export default function RiskScoreGauge({ score, classification }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const filled = (score / 100) * circumference;
  const strokeColor =
    classification === 'malicious' ? '#f87171'
    : classification === 'suspicious' ? '#fbbf24'
    : classification === 'safe' ? '#4ade80'
    : '#94a3b8';

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
          <circle cx="64" cy="64" r={radius} fill="none" stroke="#1e2d4a" strokeWidth="10" />
          <circle
            cx="64" cy="64" r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${filled} ${circumference}`}
            style={{ transition: 'stroke-dasharray 1s ease-in-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-white">{score}</span>
          <span className="text-xs text-slate-400 font-medium">/100</span>
        </div>
      </div>
      <p className="text-xs text-slate-400">Risk Score</p>
    </div>
  );
}
