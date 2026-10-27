import React from 'react';
import { cn } from '../../utils/cn';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  heightClass?: string;
}

export function ChartCard({
  title,
  subtitle,
  headerAction,
  children,
  className = '',
  heightClass = 'h-72',
}: ChartCardProps) {
  return (
    <div
      className={cn(
        'rounded-xs border border-slate-800 bg-[#0F172A] p-4 shadow-sm flex flex-col justify-between transition-colors hover:border-slate-700/80',
        className
      )}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3 mb-3">
        <div>
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
            {title}
          </h4>
          {subtitle && (
            <p className="text-[11px] font-mono text-slate-400 mt-0.5 tracking-tight">
              {subtitle}
            </p>
          )}
        </div>
        {headerAction && <div className="flex items-center space-x-2">{headerAction}</div>}
      </div>

      {/* Chart Body */}
      <div className={cn('w-full', heightClass)}>{children}</div>
    </div>
  );
}
