import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Cpu, ShieldCheck, Zap, BookOpen, ListOrdered, CheckCircle2 } from 'lucide-react';
import { AIRule } from '../types';
import { ReasoningTraceItem } from '../core/WorldState';

export interface ReasoningCardProps {
  situationSummary: string;
  confidence: number;
  threatLevel: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  threatScore?: number;
  triggeredRules?: AIRule[];
  reasoningTrace?: ReasoningTraceItem[];
  className?: string;
}

export const ReasoningCard: React.FC<ReasoningCardProps> = ({
  situationSummary,
  confidence,
  threatLevel,
  threatScore = 85,
  triggeredRules = [],
  reasoningTrace = [],
  className,
}) => {
  const [showTrace, setShowTrace] = useState(false);
  const confidencePercent = Math.round(confidence * 100);

  const getThreatBadgeVariant = (level: string) => {
    switch (level) {
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

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xs bg-blue-500/10 border border-blue-500/30 text-blue-400">
            <Cpu className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-sm font-semibold tracking-wide">Explainable AI (XAI) Synthesis</CardTitle>
            <p className="text-[11px] font-mono text-slate-400">Forward-Chaining Expert Deduction & Multi-Factor Rationale</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={getThreatBadgeVariant(threatLevel)} className="font-mono text-[10px]">
            {threatLevel} [{threatScore}/100]
          </Badge>
          <div className="flex items-center gap-1 rounded-xs border border-emerald-500/30 bg-emerald-950/30 px-2 py-0.5 text-[10px] font-mono text-emerald-400">
            <ShieldCheck className="h-3 w-3" />
            <span>{confidencePercent}% CONFIDENCE</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-1">
        {/* Situation Summary */}
        <div className="rounded-xs border border-slate-800 bg-[#0B0F17]/80 p-3.5 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-slate-400">
            <div className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-blue-400" />
              <span>Situation Summary & Core Assessment</span>
            </div>
            <span className="text-[10px] text-blue-400 font-bold">{threatLevel} THREAT STATE</span>
          </div>
          <p className="text-xs leading-relaxed text-slate-200">{situationSummary}</p>
        </div>

        {/* Triggered Expert Rules with XAI Explanations */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <div className="flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-amber-400" />
              <span className="uppercase tracking-wider">Triggered Knowledge Base Rules ({triggeredRules.length})</span>
            </div>
            <button
              onClick={() => setShowTrace(!showTrace)}
              className="inline-flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 transition-colors"
            >
              <ListOrdered className="h-3 w-3" />
              <span>{showTrace ? 'Hide Reasoning Trace' : 'View Reasoning Trace'}</span>
            </button>
          </div>

          {triggeredRules.length === 0 ? (
            <p className="text-xs text-slate-500 font-mono py-2">No active rules fired for current threshold.</p>
          ) : (
            <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
              {triggeredRules.map((rule) => (
                <div
                  key={rule.id}
                  className="rounded-xs border border-slate-800/90 bg-slate-900/60 p-3 text-xs transition-colors hover:border-slate-700 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-amber-400 font-bold">[{rule.id}]</span>
                        <span className="font-semibold text-slate-100">{rule.title}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        Category: {rule.category} | Salience Weight: {rule.priorityWeight}/100
                      </span>
                    </div>
                    <Badge variant={rule.priority === 'CRITICAL' ? 'destructive' : 'warning'} className="shrink-0 text-[9px]">
                      {rule.priority}
                    </Badge>
                  </div>

                  {/* Human-Readable XAI Explanation */}
                  <div className="rounded-xs border-l-2 border-emerald-500/70 bg-[#0B0F17]/70 px-2.5 py-1.5 text-[11px] space-y-1">
                    <div className="flex items-center gap-1 text-emerald-400 font-mono text-[10px] uppercase font-semibold">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>XAI Explanation & Ground Truth Rationale:</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{rule.explanation}</p>
                  </div>

                  {/* Recommended Action */}
                  <div className="text-[11px] text-slate-400 font-mono">
                    <span className="text-slate-400">Generated Action: </span>
                    <span className="text-slate-200">{rule.action.action}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Step-by-Step Forward-Chaining Reasoning Trace Drawer */}
        {showTrace && reasoningTrace.length > 0 && (
          <div className="rounded-xs border border-blue-500/30 bg-[#0B0F17] p-3 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-blue-400 uppercase tracking-wider">
              <span>Forward-Chaining Deductive Execution Trace</span>
              <span>{reasoningTrace.length} Steps</span>
            </div>
            <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1 font-mono text-[11px]">
              {reasoningTrace.map((t, idx) => (
                <div key={idx} className="rounded-xs border border-slate-800/80 bg-slate-900/50 p-2 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-[10px]">
                    <span className="text-blue-300 font-bold">
                      STEP {t.step}: {t.source}
                    </span>
                    <span className="text-slate-400">{t.category}</span>
                  </div>
                  <div className="text-slate-300">
                    <span className="text-slate-400">Observed: </span>
                    {t.observation}
                  </div>
                  <div className="text-emerald-300">
                    <span className="text-slate-400">Inferred: </span>
                    {t.inference}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
