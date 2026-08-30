import React from 'react';
import { ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react';
import { RiskLevel } from '../types';

interface TrustGaugeProps {
  score: number;
  riskLevel: RiskLevel;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
}

export const TrustGauge: React.FC<TrustGaugeProps> = ({
  score,
  riskLevel,
  size = 'md',
  showLabel = true
}) => {
  const getTheme = () => {
    if (score >= 90) {
      return {
        text: 'text-[#10b981]',
        stroke: '#10b981',
        bg: 'rgba(16, 185, 129, 0.1)',
        border: 'border-[#10b981]/20',
        badge: 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20',
        label: 'VERIFIED LOW RISK',
        icon: ShieldCheck
      };
    }
    if (score >= 75) {
      return {
        text: 'text-amber-400',
        stroke: '#f59e0b',
        bg: 'rgba(245, 158, 11, 0.1)',
        border: 'border-amber-500/20',
        badge: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
        label: 'MEDIUM RISK',
        icon: ShieldCheck
      };
    }
    if (score >= 50) {
      return {
        text: 'text-orange-400',
        stroke: '#f97316',
        bg: 'rgba(249, 115, 22, 0.1)',
        border: 'border-orange-500/20',
        badge: 'bg-orange-500/10 text-orange-300 border-orange-500/20',
        label: 'ELEVATED RISK',
        icon: ShieldAlert
      };
    }
    return {
      text: 'text-rose-400',
      stroke: '#f43f5e',
      bg: 'rgba(244, 63, 94, 0.1)',
      border: 'border-rose-500/20',
      badge: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
      label: 'CRITICAL / QUARANTINED',
      icon: ShieldX
    };
  };

  const theme = getTheme();
  const Icon = theme.icon;

  const dimensions = {
    sm: { radius: 20, strokeWidth: 3.5, size: 48, fontSize: 'text-xs' },
    md: { radius: 28, strokeWidth: 4.5, size: 68, fontSize: 'text-base font-bold' },
    lg: { radius: 42, strokeWidth: 6, size: 100, fontSize: 'text-2xl font-normal font-serif-display' },
    xl: { radius: 60, strokeWidth: 8, size: 140, fontSize: 'text-4xl font-normal font-serif-display' }
  }[size];

  const circumference = 2 * Math.PI * dimensions.radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center gap-1.5">
      <div
        className="relative flex items-center justify-center"
        style={{ width: dimensions.size, height: dimensions.size }}
      >
        <svg
          className="transform -rotate-90"
          width={dimensions.size}
          height={dimensions.size}
        >
          <circle
            cx={dimensions.size / 2}
            cy={dimensions.size / 2}
            r={dimensions.radius}
            stroke="#1a1a1a"
            strokeWidth={dimensions.strokeWidth}
            fill="transparent"
          />
          <circle
            cx={dimensions.size / 2}
            cy={dimensions.size / 2}
            r={dimensions.radius}
            stroke={theme.stroke}
            strokeWidth={dimensions.strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`${dimensions.fontSize} ${theme.text}`}>
            {score}
          </span>
          {size === 'xl' && (
            <span className="text-[10px] text-[#737373] font-mono tracking-widest -mt-1">/100</span>
          )}
        </div>
      </div>

      {showLabel && (
        <div className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] font-semibold uppercase tracking-wider ${theme.badge}`}>
          <Icon className="w-3 h-3" />
          <span>{theme.label}</span>
        </div>
      )}
    </div>
  );
};
