import React from 'react';
import { useAI } from '../hooks';
import { Cpu, Clock, ShieldCheck } from 'lucide-react';

export interface LiveAIStatusBarProps {
  className?: string;
  compact?: boolean;
}

export const LiveAIStatusBar: React.FC<LiveAIStatusBarProps> = ({ className = '', compact = false }) => {
  const { agentStatuses, loading, confidence } = useAI({ autoFetch: false });

  const agentKeys = [
    { key: 'WeatherAgent', label: 'Weather Agent', code: 'ENV-01' },
    { key: 'RiskAssessmentAgent', label: 'Risk Agent', code: 'RSK-02' },
    { key: 'ResourcePlanningAgent', label: 'Resource Agent', code: 'LOG-03' },
    { key: 'RoutePlanningAgent', label: 'Route Agent', code: 'NAV-04' },
    { key: 'CommunicationAgent', label: 'Comm Agent', code: 'COM-05' },
    { key: 'RuleEngine', label: 'Rule Engine', code: 'EXP-06' },
  ];

  const getStatusDisplay = (status?: string) => {
    if (loading) {
      return { text: 'Updating', color: 'text-amber-400', dot: 'bg-amber-400 animate-ping' };
    }
    switch (status) {
      case 'PROCESSING':
        return { text: 'Running', color: 'text-blue-400', dot: 'bg-blue-400 animate-pulse' };
      case 'ONLINE':
      case 'COMPLETED':
        return { text: 'Completed', color: 'text-emerald-400', dot: 'bg-emerald-400' };
      case 'IDLE':
      default:
        return { text: 'Idle', color: 'text-slate-400', dot: 'bg-slate-500' };
    }
  };

  return (
    <div
      className={`rounded-xs border border-slate-800/80 bg-[#0F172A]/90 p-3 shadow-md backdrop-blur-sm select-none ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="relative flex h-5 w-5 items-center justify-center rounded-xs bg-blue-500/20 text-blue-400 border border-blue-500/40">
            <Cpu className="h-3 w-3" />
            <span className="absolute -top-0.5 -right-0.5 flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
          </div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
            AI Multi-Agent Mission Control
          </span>
          <span className="text-[10px] font-mono text-emerald-400 border border-emerald-500/30 bg-emerald-950/30 px-1.5 py-0.2 rounded-xs">
            LIVE CONSENSUS
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Confidence: <strong className="text-emerald-400">{Math.round(confidence * 100)}%</strong></span>
          </div>
          <div className="flex items-center gap-1 text-slate-500 hidden sm:flex">
            <Clock className="h-3 w-3" />
            <span>Blackboard Sync Active</span>
          </div>
        </div>
      </div>

      {/* Agents Status Grid */}
      <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-[11px] font-mono`}>
        {agentKeys.map(({ key, label, code }) => {
          const agent = agentStatuses[key];
          const statusInfo = getStatusDisplay(agent?.status);
          const timeFormatted = agent?.lastProcessedAt
            ? new Date(agent.lastProcessedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
            : 'Synchronized';

          return (
            <div
              key={key}
              className="rounded-xs border border-slate-800/90 bg-[#0B0F17]/90 p-2 space-y-1 transition-colors hover:border-slate-700"
            >
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-semibold truncate text-[11px]">{label}</span>
                <span className="text-[9px] text-slate-500 font-bold">{code}</span>
              </div>

              <div className="flex items-center justify-between pt-0.5">
                <span className="flex items-center gap-1 text-[10px]">
                  <span className={`h-1.5 w-1.5 rounded-full ${statusInfo.dot}`} />
                  <span className={statusInfo.color}>{statusInfo.text}</span>
                </span>
                {!compact && (
                  <span className="text-[9px] text-slate-500 truncate" title={`Executed: ${timeFormatted}`}>
                    {timeFormatted}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
