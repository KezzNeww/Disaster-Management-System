import React, { useState } from 'react';
import { useAI } from '../hooks';
import { LiveAIStatusBar } from './LiveAIStatusBar';
import { AICommandCenter } from './AICommandCenter';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
  Bot,
  AlertTriangle,
  ShieldCheck,
  Zap,
  Maximize2,
  X,
  BookOpen,
  ArrowDownRight,
  FileText,
} from 'lucide-react';

export function DashboardAIInsightsSection() {
  const {
    threatLevel,
    threatScore,
    confidence,
    triggeredRules,
    recommendations,
    officerBrief,
  } = useAI({ autoFetch: false });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const topRec = recommendations[0];

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
    <div className="space-y-4">
      {/* 1. Mission Control Real-time Agent Status Bar */}
      <LiveAIStatusBar />

      {/* 2. Tactical AI Insights Card */}
      <div className="rounded-xs border border-blue-500/30 bg-[#0F172A] p-4 sm:p-5 shadow-lg relative overflow-hidden font-mono select-none">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xs bg-blue-600/20 border border-blue-500/40 text-blue-400">
              <Bot className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-white text-xs uppercase tracking-wider">
                  AI DECISION SUPPORT SYSTEM // LIVE TACTICAL INTEL
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-xs bg-blue-950/60 text-blue-400 border border-blue-500/40 font-bold">
                  AUTONOMOUS REASONING
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Blackboard continuous monitoring • Forward-chaining expert system • Advisory only
              </p>
            </div>
          </div>

          {/* Quick Metrics Cluster */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center space-x-1.5 bg-[#111827] px-2.5 py-1 rounded-xs border border-slate-800 text-xs">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
              <span className="text-slate-400 text-[10px] uppercase">THREAT:</span>
              <Badge variant={getThreatBadgeVariant(threatLevel)} className="text-[10px]">
                {threatLevel} [{threatScore}/100]
              </Badge>
            </div>

            <div className="flex items-center space-x-1.5 bg-[#111827] px-2.5 py-1 rounded-xs border border-slate-800 text-xs">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-slate-400 text-[10px] uppercase">CONFIDENCE:</span>
              <span className="text-emerald-400 font-bold text-xs">{Math.round(confidence * 100)}%</span>
            </div>

            <div className="flex items-center space-x-1.5 bg-[#111827] px-2.5 py-1 rounded-xs border border-slate-800 text-xs">
              <BookOpen className="h-3.5 w-3.5 text-sky-400" />
              <span className="text-slate-400 text-[10px] uppercase">RULES ACTIVE:</span>
              <span className="text-sky-300 font-bold text-xs">{triggeredRules.length}</span>
            </div>

            <Button
              size="sm"
              variant="default"
              onClick={() => setIsModalOpen(true)}
              className="space-x-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold"
            >
              <Maximize2 className="h-3.5 w-3.5" />
              <span>VIEW AI COMMAND CENTER</span>
            </Button>
          </div>
        </div>

        {/* 3. Main Content: Top Recommendation + Officer Brief Snippet */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-3.5">
          {/* Top Recommendation (7 cols) */}
          <div className="lg:col-span-7 rounded-xs border border-slate-800 bg-[#0B0F17]/90 p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-rose-400">
                <Zap className="h-3.5 w-3.5" />
                <span>PRIMARY AI ACTION RECOMMENDATION</span>
              </span>
              {topRec?.impactScoreReduction && (
                <div className="flex items-center gap-0.5 rounded-xs border border-emerald-500/30 bg-emerald-950/30 px-1.5 py-0.5 text-[9px] font-mono text-emerald-400">
                  <ArrowDownRight className="h-3 w-3" />
                  <span>-{topRec.impactScoreReduction}% RISK</span>
                </div>
              )}
            </div>

            {topRec ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant={getThreatBadgeVariant(topRec.priority)} className="text-[9px]">
                    {topRec.priority.replace('_', ' ')}
                  </Badge>
                  <span className="text-xs font-bold text-slate-100 font-sans">{topRec.title}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{topRec.action}</p>
                {topRec.reasoning && (
                  <div className="rounded-xs border-l-2 border-blue-500/60 bg-slate-900/60 px-2.5 py-1 text-[11px] text-slate-400">
                    <strong className="text-slate-300">Rationale: </strong>
                    {topRec.reasoning}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-3">Evaluating situational telemetry...</p>
            )}
          </div>

          {/* Officer Tactical Briefing Status (5 cols) */}
          <div className="lg:col-span-5 rounded-xs border border-slate-800 bg-[#0B0F17]/90 p-3.5 space-y-2 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-amber-400 font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5" />
                  <span>INCIDENT COMMANDER DIRECTIVES</span>
                </span>
                <span className="text-[10px] text-slate-500">EXECUTIVE BRIEF</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans line-clamp-3">
                {officerBrief?.executiveSummary || 'Tactical directives synchronized to live incident command nodes.'}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Public Advisory:</span>
              <span className="text-cyan-400 truncate max-w-[200px]">
                {officerBrief?.publicNoticeStatus ? 'Broadcasting via CAP-Alert' : 'Standby'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. MODAL DIALOG: Full AI Command Center */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-xs border border-slate-700 bg-[#0F172A] p-4 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-blue-400" />
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  AI DECISION SUPPORT SYSTEM // FULL COMMAND CENTER
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-xs border border-slate-700 bg-slate-800 p-1 text-slate-400 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Embedded Standalone AI Command Center */}
            <AICommandCenter />
          </div>
        </div>
      )}
    </div>
  );
}
