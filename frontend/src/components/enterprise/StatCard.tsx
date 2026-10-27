import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';
import { AnimatedCounter } from './AnimatedCounter';

interface StatCardProps {
  title: string;
  value: number;
  suffix?: string;
  trendText?: string;
  trendType?: 'positive' | 'negative' | 'neutral' | 'critical';
  icon: LucideIcon;
  iconColor?: string;
  delayIndex?: number;
  className?: string;
  onClick?: () => void;
}

export function StatCard({
  title,
  value,
  suffix = '',
  trendText,
  trendType = 'neutral',
  icon: Icon,
  iconColor = '#38BDF8',
  delayIndex = 0,
  className = '',
  onClick,
}: StatCardProps) {
  const trendColor = {
    critical: 'text-red-400 bg-red-950/40 border-red-500/30',
    negative: 'text-amber-400 bg-amber-950/40 border-amber-500/30',
    positive: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30',
    neutral: 'text-slate-400 bg-slate-800/40 border-slate-700/30',
  }[trendType];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delayIndex * 0.08, ease: 'easeOut' }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={cn(
        'rounded-xs border border-slate-800 bg-[#0F172A] p-4 shadow-sm hover:border-slate-700 hover:shadow-md transition-all select-none relative overflow-hidden group',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono tracking-wider uppercase text-slate-400 font-medium">
          {title}
        </span>
        <div
          className="h-8 w-8 rounded-xs flex items-center justify-center border border-slate-800 bg-[#111827] group-hover:border-slate-700 transition-colors"
          style={{ color: iconColor }}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>

      {/* Main Metric Value */}
      <div className="mt-3 flex items-baseline space-x-1 font-mono">
        <span className="text-2xl font-bold tracking-tight text-white">
          <AnimatedCounter value={value} />
        </span>
        {suffix && <span className="text-sm font-semibold text-slate-400">{suffix}</span>}
      </div>

      {/* Footer Trend Chip */}
      {trendText && (
        <div className="mt-2.5 flex items-center">
          <span
            className={cn(
              'inline-flex items-center text-[10px] font-mono px-1.5 py-0.5 rounded-xs border',
              trendColor
            )}
          >
            {trendText}
          </span>
        </div>
      )}

      {/* Subtle bottom telemetry glow */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] opacity-20 group-hover:opacity-60 transition-opacity"
        style={{ backgroundColor: iconColor }}
      />
    </motion.div>
  );
}
