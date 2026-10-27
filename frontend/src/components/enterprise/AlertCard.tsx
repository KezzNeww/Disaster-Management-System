import React from 'react';
import { ShieldAlert, MapPin, Clock, Radio, ArrowRight } from 'lucide-react';
import { cn } from '../../utils/cn';
import { StatusBadge } from './StatusBadge';
import { LiveAlertItem } from '../../mock/mockAlerts';

interface AlertCardProps {
  alert: LiveAlertItem;
  onAcknowledge?: (id: string) => void;
  className?: string;
}

export function AlertCard({ alert, onAcknowledge, className = '' }: AlertCardProps) {
  const isCritical = alert.priority === 'CRITICAL';

  return (
    <div
      className={cn(
        'p-3.5 rounded-xs border transition-all font-mono text-xs select-none relative',
        isCritical
          ? 'bg-red-950/20 border-red-500/40 hover:border-red-500/70'
          : 'bg-[#111827] border-slate-800 hover:border-slate-700',
        className
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <StatusBadge
            label={alert.priority}
            variant={
              alert.priority === 'CRITICAL'
                ? 'critical'
                : alert.priority === 'HIGH'
                ? 'high'
                : 'moderate'
            }
            pulse={isCritical}
          />
          <span className="text-slate-400 text-[11px] font-bold">{alert.id}</span>
        </div>
        <div className="flex items-center space-x-1 text-slate-500 text-[10px]">
          <Clock className="h-3 w-3" />
          <span>{alert.timestamp}</span>
        </div>
      </div>

      <p className="text-xs font-sans text-slate-200 font-medium mb-2.5 leading-snug">
        {alert.description}
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
        <div className="flex items-center space-x-1">
          <MapPin className="h-3 w-3 text-sky-400" />
          <span className="text-slate-300 truncate max-w-[180px]">{alert.location}</span>
        </div>

        {onAcknowledge && (
          <button
            onClick={() => onAcknowledge(alert.id)}
            className="flex items-center space-x-1 text-sky-400 hover:text-sky-300 font-bold transition-colors"
          >
            <span>DISPATCH</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  );
}
