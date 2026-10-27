import React, { useState } from 'react';
import { useAI } from '../hooks';
import { ReasoningCard } from './ReasoningCard';
import { RecommendationCard } from './RecommendationCard';
import { InsightCard } from './InsightCard';
import { OfficerBriefingCard } from './OfficerBriefingCard';
import { TimelineCard } from './TimelineCard';
import { WorldStateCard } from './WorldStateCard';
import { AIIntelligenceReportsCard } from './AIIntelligenceReportsCard';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
  Bot,
  RefreshCw,
  AlertTriangle,
  ShieldCheck,
  Cpu,
  Layers,
  Database,
  Radio,
  Sparkles,
  FileText,
} from 'lucide-react';

export interface AICommandCenterProps {
  className?: string;
}

export const AICommandCenter: React.FC<AICommandCenterProps> = ({ className = '' }) => {
  const {
    worldState,
    activeScenarioId,
    scenarios,
    loadScenario,
    loading,
    refresh,
    threatLevel,
    threatScore,
    situationSummary,
    confidence,
    triggeredRules,
    recommendations,
    officerBrief,
    insights,
    timeline,
    reasoningTrace,
    agentStatuses,
    currentDisaster,
  } = useAI({ autoFetch: true });

  const [activeTab, setActiveTab] = useState<'SYNTHESIS' | 'RECOMMENDATIONS' | 'BLACKBOARD' | 'TIMELINE' | 'REPORTS'>('SYNTHESIS');

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
    <div className={`space-y-5 ${className}`}>
      {/* 1. SCENARIO SELECTOR BAR */}
      <div className="rounded-xs border border-slate-800 bg-[#0F172A]/90 p-3 shadow-md backdrop-blur-sm space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
              Disaster Scenario Simulation Controller
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Current: <span className="text-blue-400 font-semibold">{currentDisaster.name}</span> ({currentDisaster.location})
          </span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {scenarios.map((s) => (
            <button
              key={s.id}
              onClick={() => loadScenario(s.id)}
              disabled={loading}
              className={`rounded-xs px-3 py-1 text-xs font-mono uppercase transition-all ${
                activeScenarioId === s.id
                  ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20 border border-blue-400/50'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* 2. COMMAND CENTER HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xs border border-slate-800 bg-[#0F172A]/90 p-4 shadow-lg backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xs bg-blue-600/20 border border-blue-500/40 text-blue-400">
            <Bot className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold tracking-tight text-slate-100">AI Decision Support System</h2>
              <Badge variant="telemetry" className="text-[10px] tracking-wider font-mono">
                BLACKBOARD EXPERT SYSTEM
              </Badge>
            </div>
            <p className="text-xs font-mono text-slate-400">
              National Emergency Operations Centre // Multi-Agent Cognitive Blackboard
            </p>
          </div>
        </div>

        {/* Global Telemetry Metrics & Trigger Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Threat Level */}
          <div className="flex items-center gap-1.5 rounded-xs border border-slate-800 bg-[#0B0F17] px-3 py-1.5">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <span className="text-[10px] font-mono uppercase text-slate-400">Threat Level:</span>
            <Badge variant={getThreatBadgeVariant(threatLevel)} className="text-[10px] font-mono">
              {threatLevel} [{threatScore}/100]
            </Badge>
          </div>

          {/* Model Confidence */}
          <div className="flex items-center gap-1.5 rounded-xs border border-slate-800 bg-[#0B0F17] px-3 py-1.5 font-mono text-xs">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span className="text-[10px] text-slate-400">System Confidence:</span>
            <span className="text-emerald-400 font-semibold">{Math.round(confidence * 100)}%</span>
          </div>

          {/* Re-Evaluate / Force Cycle */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => refresh()}
            disabled={loading}
            className="h-9 gap-1.5 border-slate-700 bg-slate-900 text-xs font-mono hover:bg-slate-800 text-slate-200"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-blue-400' : ''}`} />
            <span>{loading ? 'Reasoning Cycle...' : 'Re-Evaluate Cycle'}</span>
          </Button>
        </div>
      </div>

      {/* 3. NAVIGATION VIEW TABS */}
      <div className="flex border-b border-slate-800 gap-1 pb-1">
        <button
          onClick={() => setActiveTab('SYNTHESIS')}
          className={`flex items-center gap-1.5 rounded-xs px-3.5 py-1.5 text-xs font-mono uppercase transition-colors ${
            activeTab === 'SYNTHESIS'
              ? 'border-b-2 border-blue-500 text-blue-400 font-bold bg-blue-500/10'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Cpu className="h-3.5 w-3.5" />
          <span>Synthesis & XAI ({triggeredRules.length} Rules)</span>
        </button>

        <button
          onClick={() => setActiveTab('RECOMMENDATIONS')}
          className={`flex items-center gap-1.5 rounded-xs px-3.5 py-1.5 text-xs font-mono uppercase transition-colors ${
            activeTab === 'RECOMMENDATIONS'
              ? 'border-b-2 border-blue-500 text-blue-400 font-bold bg-blue-500/10'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          <span>Action Directives ({recommendations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('BLACKBOARD')}
          className={`flex items-center gap-1.5 rounded-xs px-3.5 py-1.5 text-xs font-mono uppercase transition-colors ${
            activeTab === 'BLACKBOARD'
              ? 'border-b-2 border-blue-500 text-blue-400 font-bold bg-blue-500/10'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Database className="h-3.5 w-3.5" />
          <span>Blackboard World State</span>
        </button>

        <button
          onClick={() => setActiveTab('TIMELINE')}
          className={`flex items-center gap-1.5 rounded-xs px-3.5 py-1.5 text-xs font-mono uppercase transition-colors ${
            activeTab === 'TIMELINE'
              ? 'border-b-2 border-blue-500 text-blue-400 font-bold bg-blue-500/10'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Radio className="h-3.5 w-3.5" />
          <span>Forecast & Response Plan</span>
        </button>

        <button
          onClick={() => setActiveTab('REPORTS')}
          className={`flex items-center gap-1.5 rounded-xs px-3.5 py-1.5 text-xs font-mono uppercase transition-colors ${
            activeTab === 'REPORTS'
              ? 'border-b-2 border-indigo-500 text-indigo-400 font-bold bg-indigo-500/10'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="h-3.5 w-3.5 text-indigo-400" />
          <span>Emergency Reports (Hybrid AI)</span>
        </button>
      </div>

      {/* 4. MAIN VIEW CONTENT */}
      {activeTab === 'SYNTHESIS' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-6">
            <ReasoningCard
              situationSummary={situationSummary}
              confidence={confidence}
              threatLevel={threatLevel}
              threatScore={threatScore}
              triggeredRules={triggeredRules}
              reasoningTrace={reasoningTrace}
            />
            <RecommendationCard recommendations={recommendations.slice(0, 4)} />
          </div>

          <div className="lg:col-span-5 space-y-6">
            <OfficerBriefingCard brief={officerBrief} />
            <InsightCard insights={insights} />
          </div>
        </div>
      )}

      {activeTab === 'RECOMMENDATIONS' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <RecommendationCard recommendations={recommendations} />
          </div>
          <div className="lg:col-span-4 space-y-6">
            <TimelineCard timeline={timeline} />
            <OfficerBriefingCard brief={officerBrief} />
          </div>
        </div>
      )}

      {activeTab === 'BLACKBOARD' && (
        <div className="space-y-6">
          <WorldStateCard worldState={worldState} />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <ReasoningCard
                situationSummary={situationSummary}
                confidence={confidence}
                threatLevel={threatLevel}
                threatScore={threatScore}
                triggeredRules={triggeredRules}
                reasoningTrace={reasoningTrace}
              />
            </div>
            <div className="lg:col-span-5">
              <InsightCard insights={insights} />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'TIMELINE' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-6">
            <TimelineCard timeline={timeline} />
          </div>
          <div className="lg:col-span-5 space-y-6">
            <OfficerBriefingCard brief={officerBrief} />
            <InsightCard insights={insights} />
          </div>
        </div>
      )}

      {activeTab === 'REPORTS' && (
        <div className="space-y-6">
          <AIIntelligenceReportsCard />
        </div>
      )}

      {/* 5. MULTI-AGENT BLACKBOARD EXECUTION STATUS BAR */}
      <div className="rounded-xs border border-slate-800/80 bg-[#0F172A]/80 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400">
            <Cpu className="h-4 w-4 text-blue-400" />
            <span>Blackboard Architecture Operational Agents</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400">
            ALL 6 MODULES SYNCHRONIZED TO SHARED WORLD STATE
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 text-[11px] font-mono">
          {Object.values(agentStatuses).map((agent) => (
            <div key={agent.agentName} className="rounded-xs border border-slate-800 bg-[#0B0F17] p-2 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-semibold truncate">{agent.agentName}</span>
                <span className={agent.status === 'ONLINE' ? 'text-emerald-400 text-[10px]' : 'text-amber-400 text-[10px]'}>
                  ● {agent.status}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 truncate" title={agent.contributionSummary}>
                {agent.contributionSummary}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
