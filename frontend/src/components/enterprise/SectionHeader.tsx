import React from 'react';
import { cn } from '../../utils/cn';

interface SectionHeaderProps {
  title: string;
  badgeText?: string;
  badgeVariant?: 'critical' | 'high' | 'telemetry' | 'success' | 'neutral';
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function SectionHeader({
  title,
  badgeText,
  badgeVariant = 'telemetry',
  description,
  actions,
  className = '',
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4',
        className
      )}
    >
      <div>
        <div className="flex items-center space-x-2">
          <h2 className="text-base sm:text-lg font-bold font-mono tracking-tight text-white uppercase">
            {title}
          </h2>
          {badgeText && (
            <span
              className={cn(
                'text-[10px] font-mono px-2 py-0.5 rounded-xs font-bold border uppercase tracking-wider',
                badgeVariant === 'critical' && 'bg-red-950/60 text-red-400 border-red-500/40',
                badgeVariant === 'high' && 'bg-amber-950/60 text-amber-400 border-amber-500/40',
                badgeVariant === 'telemetry' && 'bg-sky-950/60 text-sky-400 border-sky-500/40',
                badgeVariant === 'success' && 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40',
                badgeVariant === 'neutral' && 'bg-slate-800 text-slate-300 border-slate-700'
              )}
            >
              {badgeText}
            </span>
          )}
        </div>
        {description && (
          <p className="text-xs font-mono text-slate-400 mt-1 max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {actions && <div className="flex items-center space-x-2 shrink-0">{actions}</div>}
    </div>
  );
}
