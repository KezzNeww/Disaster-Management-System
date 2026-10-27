import React from 'react';
import { cn } from '../../utils/cn';

interface MetricRowProps {
  label: string;
  value: React.ReactNode;
  hint?: string;
  className?: string;
  highlight?: boolean;
}

export function MetricRow({
  label,
  value,
  hint,
  className = '',
  highlight = false,
}: MetricRowProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between py-2 border-b border-slate-800/80 font-mono text-xs select-none',
        highlight && 'bg-blue-950/20 px-2 rounded-xs',
        className
      )}
    >
      <div className="flex flex-col">
        <span className="text-slate-400 uppercase text-[11px] tracking-wide">{label}</span>
        {hint && <span className="text-[10px] text-slate-500">{hint}</span>}
      </div>
      <div className="text-slate-100 font-semibold text-right">{value}</div>
    </div>
  );
}
