import React from 'react';

interface ProgressRingProps {
  progress: number; // 0 - 100
  size?: number;
  strokeWidth?: number;
  strokeColor?: string;
  trailColor?: string;
  showValue?: boolean;
  unit?: string;
  label?: string;
  className?: string;
}

export function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  strokeColor = '#2563EB',
  trailColor = '#1E293B',
  showValue = true,
  unit = '%',
  label,
  className = '',
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(Math.max(progress, 0), 100) / 100) * circumference;

  return (
    <div className={`relative inline-flex flex-col items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trailColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Animated Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      {showValue && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="flex items-baseline font-mono font-bold text-white text-lg leading-none">
            <span>{Math.round(progress)}</span>
            <span className="text-xs text-slate-400 ml-0.5">{unit}</span>
          </div>
          {label && (
            <span className="text-[10px] font-mono uppercase text-slate-400 mt-1 tracking-tight">
              {label}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
