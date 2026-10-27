import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { AIInsight } from '../types';
import { Activity, CloudRain, AlertTriangle, Truck, Compass, Radio } from 'lucide-react';

export interface InsightCardProps {
  insights: AIInsight[];
  className?: string;
}

export const InsightCard: React.FC<InsightCardProps> = ({ insights, className }) => {
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'WEATHER':
        return <CloudRain className="h-3.5 w-3.5 text-cyan-400" />;
      case 'RISK':
        return <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />;
      case 'RESOURCE':
        return <Truck className="h-3.5 w-3.5 text-emerald-400" />;
      case 'ROUTE':
        return <Compass className="h-3.5 w-3.5 text-purple-400" />;
      case 'COMMUNICATION':
      default:
        return <Radio className="h-3.5 w-3.5 text-blue-400" />;
    }
  };

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'destructive';
      case 'HIGH':
        return 'warning';
      case 'MODERATE':
        return 'telemetry';
      case 'LOW':
      case 'INFO':
      default:
        return 'secondary';
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xs bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Activity className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-sm font-semibold tracking-wide">Recent AI Agent Insights</CardTitle>
            <p className="text-[11px] font-mono text-slate-400">Continuous Environmental Telemetry & Audits</p>
          </div>
        </div>
        <Badge variant="outline" className="font-mono text-[10px]">
          {insights.length} Signals
        </Badge>
      </CardHeader>

      <CardContent className="space-y-2.5 pt-1">
        {insights.length === 0 ? (
          <p className="py-6 text-center text-xs text-slate-500 font-mono">No telemetry insights recorded.</p>
        ) : (
          insights.map((insight) => (
            <div
              key={insight.id}
              className="rounded-xs border border-slate-800 bg-[#0B0F17]/70 p-3 transition-colors hover:border-slate-700 space-y-1.5"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-xs bg-slate-800/80">
                    {getInsightIcon(insight.type)}
                  </div>
                  <span className="text-xs font-semibold text-slate-200">{insight.title}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={getSeverityBadgeVariant(insight.severity)} className="text-[9px]">
                    {insight.severity}
                  </Badge>
                  <span className="text-[10px] font-mono text-slate-400">
                    {insight.sourceAgent}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed pl-8">{insight.description}</p>

              {insight.metrics && Object.keys(insight.metrics).length > 0 && (
                <div className="ml-8 flex flex-wrap gap-2 pt-1">
                  {Object.entries(insight.metrics).map(([key, val]) => (
                    <div
                      key={key}
                      className="rounded-xs border border-slate-800 bg-slate-900/60 px-2 py-0.5 font-mono text-[10px] text-slate-400"
                    >
                      <span className="text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}: </span>
                      <span className="font-semibold text-slate-200">
                        {Array.isArray(val) ? val.length : String(val)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
