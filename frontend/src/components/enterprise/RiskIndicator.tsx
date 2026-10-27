import React from 'react';
import { cn } from '../../utils/cn';

interface RiskIndicatorProps {
  score: number; // 0 - 100
  showLabel?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function RiskIndicator({
  score,
  showLabel = true,
  className = '',
  size = 'md',
}: RiskIndicatorProps) {
  let riskLevel = 'LOW';
  let color = '#22C55E'; // Success
  let bg = 'bg-emerald-500';
  let textColor = 'text-emerald-400';

  if (score >= 80) {
    riskLevel = 'CRITICAL';
    color = '#EF4444'; // Danger
    bg = 'bg-red-500';
    textColor = 'text-red-400';
  } else if (score >= 65) {
    riskLevel = 'HIGH';
    color = '#F59E0B'; // Warning
    bg = 'bg-amber-500';
    textColor = 'text-amber-400';
  } else if (score >= 45) {
    riskLevel = 'MODERATE';
    color = '#2563EB'; // Primary Blue
    bg = 'bg-blue-500';
    textColor = 'text-blue-400';
  }

  const heightClass = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-2.5',
  }[size];

  return (
    <div className={cn('space-y-1 font-mono', className)}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 text-[11px] uppercase tracking-wider">
            THREAT RISK SCORE
          </span>
          <span className={cn('font-bold', textColor)}>
            {score}/100 ({riskLevel})
          </span>
        </div>
      )}
      <div className={cn('w-full rounded-xs bg-[#111827] border border-slate-800/80 overflow-hidden', heightClass)}>
        <div
          className={cn('h-full transition-all duration-700 ease-out', bg)}
          style={{ width: `${Math.min(Math.max(score, 0), 100)}%` }}
        />
      </div>
    </div>
  );
}
