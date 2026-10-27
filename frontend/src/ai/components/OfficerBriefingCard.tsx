import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { AIOfficerBrief } from '../types';
import {
  FileText,
  ShieldAlert,
  CheckSquare,
  Truck,
  Megaphone,
  Copy,
  Download,
  Printer,
  RefreshCw,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Layers,
} from 'lucide-react';
import {
  ReportType,
  GeneratedReport,
  hybridReportService,
  ReportFormatter,
  ReportContext,
} from '../llm';
import { CommunicationAgent } from '../agents/CommunicationAgent';
import { useAI } from '../hooks';

export interface OfficerBriefingCardProps {
  brief: AIOfficerBrief | null;
  className?: string;
}

export const OfficerBriefingCard: React.FC<OfficerBriefingCardProps> = ({ brief, className }) => {
  const {
    worldState,
    threatLevel,
    threatScore,
    confidence,
    triggeredRules,
    recommendations,
    priorityActions,
    currentDisaster,
  } = useAI({ autoFetch: false });

  const [activeReportType, setActiveReportType] = useState<ReportType>('OFFICER_BRIEF');
  const [report, setReport] = useState<GeneratedReport | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const generateCurrentReport = useCallback(
    async (type: ReportType) => {
      setIsGenerating(true);
      try {
        const context: ReportContext = {
          disaster: currentDisaster,
          threatLevel,
          threatScore,
          confidence: confidence || 0.95,
          population: worldState.population,
          weather: worldState.weather,
          infrastructure: worldState.infrastructure,
          hospitals: worldState.hospitals,
          roads: worldState.roads,
          resources: worldState.resources,
          traffic: worldState.traffic,
          triggeredRules: triggeredRules || [],
          recommendations: recommendations || [],
          priorityActions: priorityActions?.length > 0 ? priorityActions : (brief?.immediateDirectives || []),
          generatedAt: new Date().toISOString(),
        };

        const result = await hybridReportService.generateReport(type, context);
        setReport(result);
        CommunicationAgent.setCachedReport(type, result);
      } catch (err) {
        console.error('[OfficerBriefingCard] Failed generating report:', err);
      } finally {
        setIsGenerating(false);
      }
    },
    [
      currentDisaster,
      threatLevel,
      threatScore,
      confidence,
      worldState,
      triggeredRules,
      recommendations,
      priorityActions,
      brief,
    ]
  );

  // Synchronize report state from cache or generate on demand
  useEffect(() => {
    const cached = CommunicationAgent.getCachedReport(activeReportType);
    if (cached) {
      setReport(cached);
    } else {
      generateCurrentReport(activeReportType);
    }
  }, [activeReportType, currentDisaster.id, generateCurrentReport]);

  const handleCopy = async () => {
    if (!report) return;
    const text = ReportFormatter.formatWithHeaderAndFooter(report);
    const success = await ReportFormatter.copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!report) return;
    ReportFormatter.downloadAsText(report);
  };

  const handlePrint = () => {
    if (!report) return;
    ReportFormatter.printReport(report);
  };

  if (!brief) {
    return (
      <Card className={className}>
        <CardContent className="py-8 text-center text-xs font-mono text-slate-500">
          No officer briefing generated.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      {/* 1. HEADER BAR */}
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 gap-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xs bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-sm font-semibold tracking-wide">Command Officer Briefing & SITREPs</CardTitle>
            <p className="text-[11px] font-mono text-slate-400">
              Hybrid Generative AI // Natural Language Document Synthesis
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="warning" className="font-mono text-[10px]">
            {report?.mode || 'Local AI Mode'}
          </Badge>
          <Badge variant="telemetry" className="font-mono text-[10px]">
            {report?.providerName || 'Expert System + Mock AI'}
          </Badge>
        </div>
      </CardHeader>

      {/* 2. REPORT TYPE SELECTOR & ACTION BUTTONS */}
      <div className="px-4 py-2 bg-[#0B0F17]/70 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => setActiveReportType('OFFICER_BRIEF')}
            className={`rounded-xs px-2.5 py-1 text-[11px] font-mono uppercase transition-colors ${
              activeReportType === 'OFFICER_BRIEF'
                ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Officer Brief
          </button>
          <button
            onClick={() => setActiveReportType('SITUATION_REPORT')}
            className={`rounded-xs px-2.5 py-1 text-[11px] font-mono uppercase transition-colors ${
              activeReportType === 'SITUATION_REPORT'
                ? 'bg-blue-500/20 text-blue-300 font-bold border border-blue-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            SITREP
          </button>
          <button
            onClick={() => setActiveReportType('EXECUTIVE_SUMMARY')}
            className={`rounded-xs px-2.5 py-1 text-[11px] font-mono uppercase transition-colors ${
              activeReportType === 'EXECUTIVE_SUMMARY'
                ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Executive Summary
          </button>
          <button
            onClick={() => setActiveReportType('PUBLIC_ADVISORY')}
            className={`rounded-xs px-2.5 py-1 text-[11px] font-mono uppercase transition-colors ${
              activeReportType === 'PUBLIC_ADVISORY'
                ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Public Advisory
          </button>
        </div>

        {/* Buttons: Generate, Copy, Download TXT, Print */}
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={() => generateCurrentReport(activeReportType)}
            disabled={isGenerating}
            className="h-7 px-2 text-[10px] font-mono border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
            title="Re-generate report"
          >
            <RefreshCw className={`h-3 w-3 mr-1 ${isGenerating ? 'animate-spin text-sky-400' : ''}`} />
            <span>Generate</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleCopy}
            disabled={!report || isGenerating}
            className="h-7 px-2 text-[10px] font-mono border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
            title="Copy formatted text"
          >
            {copied ? (
              <>
                <CheckCircle2 className="h-3 w-3 text-emerald-400 mr-1" />
                <span className="text-emerald-400 font-bold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3 mr-1" />
                <span>Copy</span>
              </>
            )}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleDownload}
            disabled={!report || isGenerating}
            className="h-7 px-2 text-[10px] font-mono border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
            title="Download TXT report"
          >
            <Download className="h-3 w-3 text-emerald-400 mr-1" />
            <span>TXT</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handlePrint}
            disabled={!report || isGenerating}
            className="h-7 px-2 text-[10px] font-mono border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
            title="Print report"
          >
            <Printer className="h-3 w-3 text-indigo-400 mr-1" />
            <span>Print</span>
          </Button>
        </div>
      </div>

      {/* 3. METADATA STRIP */}
      {report && (
        <div className="bg-[#0B0F17] px-4 py-1.5 border-b border-slate-800/80 flex flex-wrap items-center justify-between text-[10px] font-mono text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="text-slate-500">GENERATED BY:</span>
              <span className="text-slate-200 font-bold">{report.providerName}</span>
            </span>
            <span className="text-slate-700">|</span>
            <span className="flex items-center gap-1">
              <Clock className="h-2.5 w-2.5 text-amber-400" />
              <span>{report.generationTimeMs}ms</span>
            </span>
            <span className="text-slate-700">|</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-2.5 w-2.5 text-emerald-400" />
              <span>{Math.round(report.confidence * 100)}% Conf.</span>
            </span>
            <span className="text-slate-700">|</span>
            <span className="flex items-center gap-1">
              <Layers className="h-2.5 w-2.5 text-sky-400" />
              <span>{report.triggeredRulesCount} Rules</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span>{new Date(report.generatedAt).toLocaleTimeString()}</span>
            <span className="text-slate-700">|</span>
            <span className="text-indigo-400 font-semibold">{report.version}</span>
          </div>
        </div>
      )}

      {/* 4. CONTENT BODY */}
      <CardContent className="space-y-4 pt-3">
        {isGenerating ? (
          <div className="py-12 text-center font-mono space-y-2">
            <RefreshCw className="h-6 w-6 mx-auto animate-spin text-amber-400" />
            <div className="text-xs text-slate-200 font-semibold">
              Synthesizing {activeReportType.replace(/_/g, ' ')}...
            </div>
            <p className="text-[10px] text-slate-400">
              Transforming structured Blackboard decisions into formatted text
            </p>
          </div>
        ) : activeReportType === 'OFFICER_BRIEF' ? (
          <>
            {/* Executive Summary */}
            <div className="rounded-xs border border-amber-500/30 bg-amber-950/20 p-3">
              <h4 className="text-[11px] font-mono uppercase tracking-wider text-amber-400 mb-1">
                Executive Assessment
              </h4>
              <p className="text-xs text-slate-200 leading-relaxed">{brief.executiveSummary}</p>
            </div>

            {/* Two Column Grid for Threats and Directives */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Key Threats */}
              <div className="rounded-xs border border-slate-800 bg-[#0B0F17]/80 p-3 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-rose-400">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  <span>Primary Threats</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {brief.keyThreats.map((threat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="font-mono text-rose-400/80">•</span>
                      <span>{threat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Immediate Directives */}
              <div className="rounded-xs border border-slate-800 bg-[#0B0F17]/80 p-3 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-blue-400">
                  <CheckSquare className="h-3.5 w-3.5" />
                  <span>Immediate Directives</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {brief.immediateDirectives.map((directive, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="font-mono text-blue-400/80 font-bold">{idx + 1}.</span>
                      <span>{directive}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Logistics and Public Notice Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="rounded-xs border border-slate-800 bg-slate-900/50 p-2.5 flex items-start gap-2.5">
                <Truck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-0.5">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">Logistics & Supply</span>
                  <p className="text-slate-300">{brief.logisticsOverview}</p>
                </div>
              </div>

              <div className="rounded-xs border border-slate-800 bg-slate-900/50 p-2.5 flex items-start gap-2.5">
                <Megaphone className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-0.5">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">Public Advisory Push</span>
                  <p className="text-slate-300">{brief.publicNoticeStatus}</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Markdown / Formatted Text for SITREP, EXECUTIVE_SUMMARY, PUBLIC_ADVISORY */
          <div className="rounded-xs border border-slate-800 bg-[#0B0F17] p-4 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed max-h-[420px] overflow-y-auto">
            {report?.content || 'Loading report...'}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
