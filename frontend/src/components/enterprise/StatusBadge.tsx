import React from 'react';
import { cn } from '../../utils/cn';

export type StatusVariant =
  | 'critical'
  | 'high'
  | 'warning'
  | 'moderate'
  | 'low'
  | 'success'
  | 'optimal'
  | 'telemetry'
  | 'cyan'
  | 'neutral';

interface StatusBadgeProps {
  label: string;
  variant?: StatusVariant;
  pulse?: boolean;
  className?: string;
  size?: 'xs' | 'sm' | 'md';
}

const variantStyles: Record<StatusVariant, { bg: string; text: string; border: string; dot: string }> = {
  critical: {
    bg: 'bg-red-950/60',
    text: 'text-red-400',
    border: 'border-red-500/40',
    dot: 'bg-red-500',
  },
  high: {
    bg: 'bg-amber-950/60',
    text: 'text-amber-400',
    border: 'border-amber-500/40',
    dot: 'bg-amber-500',
  },
  warning: {
    bg: 'bg-amber-950/60',
    text: 'text-amber-400',
    border: 'border-amber-500/40',
    dot: 'bg-amber-500',
  },
  moderate: {
    bg: 'bg-blue-950/60',
    text: 'text-blue-400',
    border: 'border-blue-500/40',
    dot: 'bg-blue-500',
  },
  low: {
    bg: 'bg-slate-800/80',
    text: 'text-slate-300',
    border: 'border-slate-700',
    dot: 'bg-slate-400',
  },
  success: {
    bg: 'bg-emerald-950/60',
    text: 'text-emerald-400',
    border: 'border-emerald-500/40',
    dot: 'bg-emerald-500',
  },
  optimal: {
    bg: 'bg-emerald-950/60',
    text: 'text-emerald-400',
    border: 'border-emerald-500/40',
    dot: 'bg-emerald-500',
  },
  telemetry: {
    bg: 'bg-sky-950/60',
    text: 'text-sky-400',
    border: 'border-sky-500/40',
    dot: 'bg-sky-400',
  },
  cyan: {
    bg: 'bg-sky-950/60',
    text: 'text-sky-400',
    border: 'border-sky-500/40',
    dot: 'bg-sky-400',
  },
  neutral: {
    bg: 'bg-[#111827]',
    text: 'text-slate-400',
    border: 'border-slate-800',
    dot: 'bg-slate-500',
  },
};

export function StatusBadge({
  label,
  variant = 'neutral',
  pulse = false,
  className = '',
  size = 'xs',
}: StatusBadgeProps) {
  const style = variantStyles[variant] || variantStyles.neutral;

  const sizeClasses = {
    xs: 'text-[10px] px-2 py-0.5 tracking-wider',
    sm: 'text-xs px-2.5 py-0.5 tracking-wide',
    md: 'text-xs px-3 py-1 font-semibold',
  }[size];

  return (
    <span
      className={cn(
        'inline-flex items-center space-x-1.5 rounded-xs font-mono uppercase font-semibold border backdrop-blur-sm select-none',
        style.bg,
        style.text,
        style.border,
        sizeClasses,
        className
      )}
    >
      <span className="relative flex h-1.5 w-1.5">
        {pulse && (
          <span
            className={cn(
              'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
              style.dot
            )}
          />
        )}
        <span className={cn('relative inline-flex rounded-full h-1.5 w-1.5', style.dot)} />
      </span>
      <span>{label}</span>
    </span>
  );
}
