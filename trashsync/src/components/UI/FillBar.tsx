import React from 'react';

interface FillBarProps {
  percentage: number;
  height?: string;
  showLabel?: boolean;
  animated?: boolean;
}

const getFillColor = (pct: number) => {
  if (pct < 50) return 'bg-emerald-500';
  if (pct < 80) return 'bg-amber-500';
  return 'bg-red-500';
};

const getGlowColor = (pct: number) => {
  if (pct < 50) return 'shadow-[0_0_8px_rgba(16,185,129,0.5)]';
  if (pct < 80) return 'shadow-[0_0_8px_rgba(245,158,11,0.5)]';
  return 'shadow-[0_0_8px_rgba(239,68,68,0.5)]';
};

export const FillBar: React.FC<FillBarProps> = ({
  percentage,
  height = 'h-2',
  showLabel = false,
  animated = true,
}) => {
  const clamped = Math.min(100, Math.max(0, percentage));
  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>Level</span>
          <span className="font-semibold">{clamped}%</span>
        </div>
      )}
      <div className={`w-full ${height} bg-slate-700/60 rounded-full overflow-hidden`}>
        <div
          className={`${height} rounded-full transition-all duration-700 ${getFillColor(clamped)} ${getGlowColor(clamped)} ${animated ? 'fill-bar-animate' : ''}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};

interface CircularGaugeProps {
  percentage: number;
  size?: number;
}

export const CircularGauge: React.FC<CircularGaugeProps> = ({ percentage, size = 80 }) => {
  const clamped = Math.min(100, Math.max(0, percentage));
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  const color = clamped < 50 ? '#10b981' : clamped < 80 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#1e293b" strokeWidth="8" />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={color} strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease-out', filter: `drop-shadow(0 0 4px ${color})` }}
        />
      </svg>
      <span className="absolute text-sm font-bold" style={{ color }}>
        {clamped}%
      </span>
    </div>
  );
};
