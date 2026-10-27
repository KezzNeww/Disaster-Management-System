import React from 'react';
import { cn } from '../../utils/cn';

interface HeatLegendProps {
  className?: string;
}

export function HeatLegend({ className = '' }: HeatLegendProps) {
  return (
    <div
      className={cn(
        'rounded-xs border border-slate-800 bg-[#0F172A]/90 p-2.5 backdrop-blur-md font-mono text-[11px] select-none shadow-xl space-y-1.5',
        className
      )}
    >
      <div className="flex items-center justify-between text-slate-300 font-bold border-b border-slate-800 pb-1">
        <span>HAZARD SEVERITY GRADIENT</span>
        <span className="text-[10px] text-slate-500 font-normal">ISO-22320</span>
      </div>

      <div className="space-y-1 text-[10px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500 border border-red-400" />
            <span className="text-slate-300">CRITICAL THREAT</span>
          </div>
          <span className="text-red-400 font-bold">80 - 100</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500 border border-amber-400" />
            <span className="text-slate-300">HIGH SEVERITY</span>
          </div>
          <span className="text-amber-400 font-bold">60 - 79</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500 border border-blue-400" />
            <span className="text-slate-300">MODERATE WATCH</span>
          </div>
          <span className="text-blue-400 font-bold">40 - 59</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 border border-emerald-400" />
            <span className="text-slate-300">CONTAINED / ADVISORY</span>
          </div>
          <span className="text-emerald-400 font-bold">0 - 39</span>
        </div>
      </div>
    </div>
  );
}
