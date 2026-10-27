import React from 'react';
import { Layers, Crosshair } from 'lucide-react';
import { cn } from '../../utils/cn';

interface MapCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  headerControls?: React.ReactNode;
  footerTelemetry?: React.ReactNode;
  className?: string;
  heightClass?: string;
}

export function MapCard({
  title,
  subtitle,
  children,
  headerControls,
  footerTelemetry,
  className = '',
  heightClass = 'h-[460px]',
}: MapCardProps) {
  return (
    <div
      className={cn(
        'rounded-xs border border-slate-800 bg-[#0F172A] shadow-sm flex flex-col overflow-hidden relative',
        className
      )}
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-[#111827] border-b border-slate-800 z-10">
        <div>
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-100 flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            <span>{title}</span>
          </h3>
          {subtitle && (
            <p className="text-[10px] font-mono text-slate-400 mt-0.5">{subtitle}</p>
          )}
        </div>

        {headerControls && (
          <div className="flex items-center space-x-2">{headerControls}</div>
        )}
      </div>

      {/* Map Viewport Area */}
      <div className={cn('w-full relative', heightClass)}>{children}</div>

      {/* Optional Footer Telemetry */}
      {footerTelemetry && (
        <div className="p-2 border-t border-slate-800 bg-[#111827] text-[10px] font-mono text-slate-400 flex items-center justify-between z-10">
          {footerTelemetry}
        </div>
      )}
    </div>
  );
}
