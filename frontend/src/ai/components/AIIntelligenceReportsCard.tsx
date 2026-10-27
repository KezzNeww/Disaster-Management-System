import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
  FileText,
  Copy,
  Download,
  Printer,
  RefreshCw,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Key,
  Layers,
  Clock,
  Terminal,
} from 'lucide-react';
import {
  ReportType,
  GeneratedReport,
  ReportContext,
  hybridReportService,
  ReportFormatter,
  AIProviderMode,
} from '../llm';
import { useAI } from '../hooks';
import { CommunicationAgent } from '../agents/CommunicationAgent';

export interface AIIntelligenceReportsCardProps {
  className?: string;
}

export const AIIntelligenceReportsCard: React.FC<AIIntelligenceReportsCardProps> = ({ className = '' }) => {
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
  const [activeMode, setActiveMode] = useState<AIProviderMode>(hybridReportService.getActiveMode());
  const [currentReport, setCurrentReport] = useState<GeneratedReport | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState<boolean>(false);
  const [apiKeyInput, setApiKeyInput] = useState<string>(hybridReportService.getOpenAIApiKey());
  const [rawView, setRawView] = useState<boolean>(false);

  // Construct structured factual context from Blackboard & Decision Engine
  const reportContext: ReportContext = useMemo(() => {
    return {
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
      priorityActions: priorityActions?.length > 0 ? priorityActions : [
        `Enforce Tier-1 Incident Command System protocols across ${currentDisaster.location}`,
        `Order mandatory civilian evacuation from vulnerable lowlands before nightfall`,
        `Preserve potable water reserves and deploy high-clearance extraction teams`,
      ],
      generatedAt: new Date().toISOString(),
    };
  }, [worldState, threatLevel, threatScore, confidence, triggeredRules, recommendations, priorityActions, currentDisaster]);

  // Load or generate report
  const handleGenerate = useCallback(
    async (type: ReportType = activeReportType) => {
      setIsGenerating(true);
      try {
        const report = await hybridReportService.generateReport(type, reportContext);
        setCurrentReport(report);
        CommunicationAgent.setCachedReport(type, report);
      } catch (err) {
        console.error('[AIIntelligenceReportsCard] Failed to generate report:', err);
      } finally {
        setIsGenerating(false);
      }
    },
    [activeReportType, reportContext]
  );

  // On mount or tab switch, load from cache or auto-generate
  useEffect(() => {
    const cached = CommunicationAgent.getCachedReport(activeReportType);
    if (cached) {
      setCurrentReport(cached);
    } else {
      handleGenerate(activeReportType);
    }
  }, [activeReportType, handleGenerate]);

  // Handle Copy to clipboard
  const handleCopy = async () => {
    if (!currentReport) return;
    const fullText = ReportFormatter.formatWithHeaderAndFooter(currentReport);
    const success = await ReportFormatter.copyToClipboard(fullText);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Handle Download TXT
  const handleDownload = () => {
    if (!currentReport) return;
    ReportFormatter.downloadAsText(currentReport);
  };

  // Handle Print
  const handlePrint = () => {
    if (!currentReport) return;
    ReportFormatter.printReport(currentReport);
  };

  // Mode Toggle (Mock vs OpenAI)
  const handleModeChange = (newMode: AIProviderMode) => {
    setActiveMode(newMode);
    hybridReportService.setActiveMode(newMode);
    handleGenerate(activeReportType);
  };

  // Save API key
  const handleSaveApiKey = () => {
    hybridReportService.setOpenAIApiKey(apiKeyInput);
    if (apiKeyInput.trim()) {
      setActiveMode('OPENAI');
    }
    setShowApiKeyInput(false);
    handleGenerate(activeReportType);
  };

  const reportTabs: Array<{ id: ReportType; label: string; badge: string }> = [
    { id: 'OFFICER_BRIEF', label: 'Officer Brief', badge: 'TACTICAL' },
    { id: 'SITUATION_REPORT', label: 'Situation Report', badge: 'SITREP' },
    { id: 'EXECUTIVE_SUMMARY', label: 'Executive Summary', badge: 'CABINET' },
    { id: 'PUBLIC_ADVISORY', label: 'Public Advisory', badge: 'CIVIL DEFENSE' },
  ];

  return (
    <Card className={`border-slate-800 bg-[#0F172A]/90 shadow-xl backdrop-blur-sm ${className}`}>
      {/* 1. CARD HEADER & AUDIT METADATA */}
      <CardHeader className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xs bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-bold tracking-wide text-slate-100 uppercase">
                Hybrid AI Emergency Intelligence Documents
              </CardTitle>
              <Badge variant="telemetry" className="text-[10px] font-mono">
                HYBRID ARCHITECTURE
              </Badge>
            </div>
            <p className="text-[11px] font-mono text-slate-400">
              Operational decisions: <span className="text-sky-400 font-semibold">Classical Expert System</span> | Natural language articulation: <span className="text-indigo-400 font-semibold">{currentReport?.providerName || 'AI Provider'}</span>
            </p>
          </div>
        </div>

        {/* Mode & Failsafe Controller */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Provider Mode Indicator */}
          <div className="flex items-center gap-1 rounded-xs border border-slate-800 bg-[#0B0F17] px-2.5 py-1">
            <Cpu className="h-3.5 w-3.5 text-indigo-400" />
            <span className="text-[10px] font-mono uppercase text-slate-400">Mode:</span>
            <span className={`text-[10px] font-mono font-bold ${activeMode === 'OPENAI' ? 'text-indigo-400' : 'text-emerald-400'}`}>
              {activeMode === 'OPENAI' ? 'OpenAI Mode' : 'Running in Local AI Mode'}
            </span>
          </div>

          {/* Toggle between Local AI & OpenAI */}
          <div className="flex rounded-xs border border-slate-800 bg-[#0B0F17] p-0.5">
            <button
              onClick={() => handleModeChange('MOCK')}
              className={`rounded-xs px-2 py-0.5 text-[10px] font-mono uppercase transition-colors ${
                activeMode === 'MOCK'
                  ? 'bg-emerald-600/30 text-emerald-300 font-bold border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Deterministic offline synthesis via template engine"
            >
              Local Mock AI
            </button>
            <button
              onClick={() => handleModeChange('OPENAI')}
              className={`rounded-xs px-2 py-0.5 text-[10px] font-mono uppercase transition-colors ${
                activeMode === 'OPENAI'
                  ? 'bg-indigo-600/30 text-indigo-300 font-bold border border-indigo-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Cloud LLM via OpenAI API (auto falls back to Local AI if unavailable)"
            >
              OpenAI
            </button>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowApiKeyInput(!showApiKeyInput)}
            className="h-7 px-2 text-[10px] font-mono border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800"
            title="Configure OpenAI API Key"
          >
            <Key className="h-3 w-3 text-amber-400 mr-1" />
            <span>API Key</span>
          </Button>
        </div>
      </CardHeader>

      {/* Optional OpenAI API Key Dialog Bar */}
      {showApiKeyInput && (
        <div className="border-b border-slate-800 bg-[#0B0F17] p-3 flex flex-wrap items-center gap-2 font-mono text-xs">
          <Key className="h-3.5 w-3.5 text-amber-400" />
          <span className="text-slate-300">OpenAI API Key:</span>
          <input
            type="password"
            value={apiKeyInput}
            onChange={(e) => setApiKeyInput(e.target.value)}
            placeholder="sk-proj-..."
            className="flex-1 min-w-[220px] rounded-xs border border-slate-800 bg-[#111827] px-2.5 py-1 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
          />
          <Button size="sm" onClick={handleSaveApiKey} className="h-7 text-xs bg-indigo-600 hover:bg-indigo-500 text-white">
            Apply Key
          </Button>
          <span className="text-[10px] text-slate-400">
            *If key is empty or API fails, system automatically runs in Local AI Mode without interruption.
          </span>
        </div>
      )}

      {/* 2. REPORT SELECTION TABS & ACTION BUTTONS */}
      <div className="border-b border-slate-800/80 bg-[#0B0F17]/60 px-4 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Four Report Type Buttons */}
        <div className="flex flex-wrap gap-1.5">
          {reportTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveReportType(tab.id)}
              className={`flex items-center gap-1.5 rounded-xs px-3 py-1.5 text-xs font-mono uppercase transition-all ${
                activeReportType === tab.id
                  ? 'bg-blue-600 text-white font-bold shadow-sm shadow-blue-500/30 border border-blue-400/40'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              <span className="text-[9px] px-1 py-0.2 rounded-xs bg-black/40 text-slate-300">
                {tab.badge}
              </span>
            </button>
          ))}
        </div>

        {/* Action Buttons: Generate, Copy, Download TXT, Print */}
        <div className="flex flex-wrap items-center gap-1.5">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleGenerate(activeReportType)}
            disabled={isGenerating}
            className="h-8 gap-1.5 border-slate-700 bg-slate-900 text-xs font-mono text-slate-200 hover:bg-slate-800"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-sky-400 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Synthesizing...' : 'Generate Report'}</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleCopy}
            disabled={!currentReport || isGenerating}
            className="h-8 gap-1.5 border-slate-700 bg-slate-900 text-xs font-mono text-slate-200 hover:bg-slate-800"
          >
            {copied ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-bold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-slate-300" />
                <span>Copy</span>
              </>
            )}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleDownload}
            disabled={!currentReport || isGenerating}
            className="h-8 gap-1.5 border-slate-700 bg-slate-900 text-xs font-mono text-slate-200 hover:bg-slate-800"
          >
            <Download className="h-3.5 w-3.5 text-emerald-400" />
            <span>Download TXT</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handlePrint}
            disabled={!currentReport || isGenerating}
            className="h-8 gap-1.5 border-slate-700 bg-slate-900 text-xs font-mono text-slate-200 hover:bg-slate-800"
          >
            <Printer className="h-3.5 w-3.5 text-indigo-400" />
            <span>Print</span>
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => setRawView(!rawView)}
            className="h-8 px-2 text-xs font-mono text-slate-400 hover:text-slate-200"
            title="Toggle Monospaced Raw SITREP View"
          >
            <Terminal className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* 3. REPORT METADATA BANNER (STEP: PROFESSIONAL FEATURES) */}
      {currentReport && (
        <div className="bg-[#0B0F17] border-b border-slate-800/80 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
          <div className="flex flex-wrap items-center gap-3 text-slate-400">
            <span className="flex items-center gap-1">
              <span className="text-slate-500">GENERATED BY:</span>
              <span className="text-slate-200 font-bold">{currentReport.providerName}</span>
            </span>
            <span className="text-slate-700">|</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-amber-400" />
              <span className="text-slate-500">TIME:</span>
              <span className="text-amber-300">{currentReport.generationTimeMs}ms</span>
            </span>
            <span className="text-slate-700">|</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-emerald-400" />
              <span className="text-slate-500">CONFIDENCE:</span>
              <span className="text-emerald-400 font-bold">{Math.round(currentReport.confidence * 100)}%</span>
            </span>
            <span className="text-slate-700">|</span>
            <span className="flex items-center gap-1">
              <Layers className="h-3 w-3 text-sky-400" />
              <span className="text-slate-500">RULES TRIGGERED:</span>
              <span className="text-sky-300 font-bold">{currentReport.triggeredRulesCount} Rules</span>
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-400">
            <span className="flex items-center gap-1">
              <span className="text-slate-500">TIMESTAMP:</span>
              <span className="text-slate-300">{new Date(currentReport.generatedAt).toLocaleTimeString()}</span>
            </span>
            <span className="text-slate-700">|</span>
            <span className="flex items-center gap-1">
              <span className="text-slate-500">VERSION:</span>
              <span className="text-indigo-400 font-bold">{currentReport.version}</span>
            </span>
          </div>
        </div>
      )}

      {/* 4. MAIN REPORT CONTENT BODY */}
      <CardContent className="p-4">
        {isGenerating ? (
          <div className="py-16 text-center space-y-3 font-mono">
            <RefreshCw className="h-8 w-8 mx-auto animate-spin text-blue-400" />
            <div className="text-sm text-slate-200 font-bold">
              Synthesizing {activeReportType.replace(/_/g, ' ')}...
            </div>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Extracting structured facts from Blackboard shared memory and applying emergency management communication protocols.
            </p>
          </div>
        ) : !currentReport ? (
          <div className="py-12 text-center text-xs font-mono text-slate-400">
            No report generated yet. Click "Generate Report" above.
          </div>
        ) : rawView ? (
          /* Raw Monospaced Stamped SITREP Output */
          <div className="rounded-xs border border-slate-800 bg-[#0B0F17] p-4 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-[550px]">
            {ReportFormatter.formatWithHeaderAndFooter(currentReport)}
          </div>
        ) : (
          /* Formatted Markdown-Style Emergency Document View */
          <div className="rounded-xs border border-slate-800 bg-[#0B0F17]/90 p-5 space-y-4 max-h-[550px] overflow-y-auto">
            {/* Document Header Banner */}
            <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-100 tracking-tight">
                  {currentReport.title}
                </h3>
                <p className="text-xs font-mono text-slate-400">
                  National Emergency Management Authority // Crisis Classification: <span className="text-rose-400 font-bold">{threatLevel}</span>
                </p>
              </div>
              <Badge variant={threatLevel === 'CRITICAL' ? 'destructive' : 'warning'} className="font-mono text-xs uppercase self-start">
                {currentReport.mode}
              </Badge>
            </div>

            {/* Document Body Formatted */}
            <div className="prose prose-invert prose-xs max-w-none font-mono text-slate-200 space-y-3 whitespace-pre-wrap text-xs leading-relaxed">
              {currentReport.content}
            </div>

            {/* Verification Watermark */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-indigo-400" />
                All decisions, threat ratings & evacuation routes computed authoritatively by Classical Expert System.
              </span>
              <span className="text-emerald-400 font-bold">
                ✓ VERIFIED FOR OFFICIAL DISSEMINATION
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
