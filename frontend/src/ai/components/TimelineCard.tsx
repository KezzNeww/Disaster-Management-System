import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { AIPredictionTimelineItem } from '../types';
import { Clock, Layers } from 'lucide-react';

export interface TimelineCardProps {
  timeline: AIPredictionTimelineItem[];
  className?: string;
}

export const TimelineCard: React.FC<TimelineCardProps> = ({ timeline, className }) => {
  const [activeTab, setActiveTab] = useState<'FORECAST' | 'RESPONSE_PLAN'>('FORECAST');

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'destructive';
      case 'HIGH':
        return 'warning';
      case 'MODERATE':
        return 'telemetry';
      default:
        return 'secondary';
    }
  };

  const responsePhases = [
    {
      phase: 'Phase 1: Life Safety & Mandatory Egress',
      timeframe: 'T + 0h to T + 4h',
      focus: 'Preemptive civilian clearance, coastal siren alerting, and evacuation route contraflow.',
      status: 'ACTIVE EXECUTION',
    },
    {
      phase: 'Phase 2: Route Clearing & Critical Airlift',
      timeframe: 'T + 4h to T + 12h',
      focus: 'Bailey bridge staging, ICU rotary aeromedical transport, and utility generator cut-overs.',
      status: 'STAGED',
    },
    {
      phase: 'Phase 3: Logistical Resupply & Sustenance',
      timeframe: 'T + 12h to T + 24h',
      focus: 'Water purification skids, emergency food kits distribution, and shelter overflow beds.',
      status: 'SCHEDULED',
    },
    {
      phase: 'Phase 4: Damage Assessment & Recovery',
      timeframe: 'T + 24h to T + 48h',
      focus: 'Drone aerial thermography surveys, municipal drinking water recertification, and all-clear.',
      status: 'PLANNED',
    },
  ];

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xs bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-sm font-semibold tracking-wide">Predictive Impact & Response Timeline</CardTitle>
            <p className="text-[11px] font-mono text-slate-400">Chronological Hazard Progression & Staged Phasing</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('FORECAST')}
            className={`rounded-xs px-2 py-0.5 font-mono text-[10px] uppercase transition-colors ${
              activeTab === 'FORECAST'
                ? 'bg-indigo-600 text-white font-semibold'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Hazard Trajectory
          </button>
          <button
            onClick={() => setActiveTab('RESPONSE_PLAN')}
            className={`rounded-xs px-2 py-0.5 font-mono text-[10px] uppercase transition-colors ${
              activeTab === 'RESPONSE_PLAN'
                ? 'bg-indigo-600 text-white font-semibold'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Response Plan
          </button>
        </div>
      </CardHeader>

      <CardContent className="pt-1">
        {activeTab === 'FORECAST' ? (
          <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
            {timeline.map((point, idx) => (
              <div key={idx} className="relative group">
                {/* Dot on timeline */}
                <div
                  className={`absolute -left-[21px] top-1 h-3 w-3 rounded-full border-2 border-[#0F172A] ${
                    point.projectedSeverity === 'CRITICAL'
                      ? 'bg-red-500 ring-2 ring-red-500/20'
                      : point.projectedSeverity === 'HIGH'
                      ? 'bg-amber-500 ring-2 ring-amber-500/20'
                      : 'bg-blue-500'
                  }`}
                />

                <div className="rounded-xs border border-slate-800 bg-[#0B0F17]/80 p-3 space-y-2 transition-colors hover:border-slate-700">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-100">{point.timeOffset}</span>
                      <Badge variant={getSeverityBadgeVariant(point.projectedSeverity)} className="text-[9px]">
                        {point.projectedSeverity}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                      <span>Urgency:</span>
                      <span
                        className={`font-semibold ${
                          point.evacuationUrgencyPercent > 80
                            ? 'text-red-400'
                            : point.evacuationUrgencyPercent > 50
                            ? 'text-amber-400'
                            : 'text-slate-300'
                        }`}
                      >
                        {point.evacuationUrgencyPercent}%
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{point.description}</p>

                  {/* Progress bar for impact factor */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-slate-400">
                      <span>Projected Impact Intensity</span>
                      <span>{point.impactFactor}/100</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          point.impactFactor > 75
                            ? 'bg-rose-500'
                            : point.impactFactor > 50
                            ? 'bg-amber-500'
                            : 'bg-blue-500'
                        }`}
                        style={{ width: `${point.impactFactor}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2.5">
            {responsePhases.map((phase, idx) => (
              <div
                key={idx}
                className="rounded-xs border border-slate-800 bg-[#0B0F17]/80 p-3 space-y-1.5 transition-colors hover:border-slate-700"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-xs bg-indigo-500/20 text-indigo-400 font-mono text-[10px] font-bold">
                      {idx + 1}
                    </div>
                    <span className="text-xs font-semibold text-slate-200">{phase.phase}</span>
                  </div>
                  <Badge
                    variant={phase.status === 'ACTIVE EXECUTION' ? 'destructive' : 'secondary'}
                    className="text-[9px] font-mono"
                  >
                    {phase.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-indigo-400 pl-7">
                  <Layers className="h-3 w-3" />
                  <span>Timeline: {phase.timeframe}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pl-7">{phase.focus}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
