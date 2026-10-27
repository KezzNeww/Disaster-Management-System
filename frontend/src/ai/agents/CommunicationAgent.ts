import { IBlackboardAgent, AgentExecutionContext } from '../core/AgentContext';
import { AIInsight, AIRecommendation, AIOfficerBrief } from '../types';
import { EmergencyAlert } from '../core/WorldState';
import { hybridReportService, ReportContext, ReportType, GeneratedReport } from '../llm';

export interface CommunicationSynthesis {
  officerBrief: AIOfficerBrief;
  situationReport: string;
  emergencyBulletin: string;
  publicAdvisory: string;
}

export class CommunicationAgent implements IBlackboardAgent {
  public readonly name = 'CommunicationAgent';
  public readonly category = 'TACTICAL_COMMUNICATIONS';

  // Cache of the latest generated reports for rapid multi-tab access
  public static cachedReports: Partial<Record<ReportType, GeneratedReport>> = {};

  public static getCachedReport(type: ReportType): GeneratedReport | undefined {
    return CommunicationAgent.cachedReports[type];
  }

  public static setCachedReport(type: ReportType, report: GeneratedReport): void {
    CommunicationAgent.cachedReports[type] = report;
  }

  public async execute(context: AgentExecutionContext): Promise<void> {
    const { blackboard, logTrace } = context;
    const state = blackboard.getState();
    const {
      currentDisaster,
      currentRiskLevel,
      threatScore,
      weather,
      population,
      infrastructure,
      hospitals,
      roads,
      resources,
      traffic,
    } = state;

    blackboard.updateAgentStatus(this.name, 'PROCESSING', 'Synthesizing tactical briefs, bulletins, and public advisories via AI Provider...');

    // 1. Identify key threats for structured brief
    const keyThreats: string[] = [];
    if (weather.rainfallMm >= 150) keyThreats.push(`Extreme rainfall (${weather.rainfallMm}mm) overtopping downstream drainage basins.`);
    if (weather.windSpeedKmph >= 100) keyThreats.push(`Gale force winds (${weather.windSpeedKmph} km/h) tearing roofs and felling trees.`);
    if ((weather.stormSurgeMeters ?? 0) >= 2.0) keyThreats.push(`Ocean surge crest of +${weather.stormSurgeMeters}m threatening coastal lowlands.`);
    if (infrastructure.bridgesCollapsed > 0) keyThreats.push(`Arterial bridge structural collapse severing primary transit.`);
    if (hospitals.icuBedsAvailable <= 5) keyThreats.push(`Regional trauma centers reaching critical ICU bed exhaustion (${hospitals.icuBedsAvailable} left).`);

    const immediateDirectives: string[] = [
      `Enforce Tier-1 Incident Command System protocols across ${currentDisaster.location}`,
      `Order mandatory relocation of populations situated in lowest elevation floodplains`,
      `Secure municipal water and pharmaceutical warehouses with auxiliary generator power`,
      `Station high-clearance extraction vehicles along high-elevation inland spine`,
    ];

    // 2. Build ReportContext for Generative AI Provider
    const reportContext: ReportContext = {
      disaster: currentDisaster,
      threatLevel: currentRiskLevel,
      threatScore,
      confidence: state.systemConfidence || 0.95,
      population,
      weather,
      infrastructure,
      hospitals,
      roads,
      resources,
      traffic,
      triggeredRules: state.triggeredRules || [],
      recommendations: state.generatedRecommendations || [],
      priorityActions: state.priorityActions.length > 0 ? state.priorityActions : immediateDirectives,
      generatedAt: new Date().toISOString(),
    };

    // 3. Generate Officer Brief via active AI Provider (MockProvider or OpenAIProvider)
    let briefReport: GeneratedReport;
    try {
      briefReport = await hybridReportService.generateReport('OFFICER_BRIEF', reportContext);
      CommunicationAgent.setCachedReport('OFFICER_BRIEF', briefReport);
    } catch (err) {
      console.warn('[CommunicationAgent] Error generating report via provider. Utilizing failsafe synthesis.', err);
      briefReport = {
        id: `rep-fallback-${Date.now()}`,
        type: 'OFFICER_BRIEF',
        title: `Tactical Field Briefing - ${currentDisaster.name}`,
        content: `INCIDENT COMMAND TACTICAL BRIEFING: ${currentDisaster.name} is currently designated at ${currentRiskLevel} THREAT (Risk Index: ${threatScore}/100). Environmental telemetry indicates deteriorating trends across ${currentDisaster.location}. Prioritize mass civilian clearance from lowlands before darkness.`,
        summary: `Incident status: ${currentRiskLevel} (${threatScore}/100). Evacuation operations active across ${currentDisaster.location}.`,
        provider: 'MOCK',
        providerName: 'Expert System + Mock AI (Failsafe)',
        mode: 'Local AI Mode',
        generatedAt: new Date().toISOString(),
        generationTimeMs: 12,
        confidence: state.systemConfidence || 0.95,
        triggeredRulesCount: state.triggeredRules?.length || 0,
        version: 'v2.5-HYBRID',
      };
      CommunicationAgent.setCachedReport('OFFICER_BRIEF', briefReport);
    }

    const officerBrief: AIOfficerBrief = {
      executiveSummary: briefReport.summary || briefReport.content.slice(0, 320),
      keyThreats: keyThreats.slice(0, 4),
      immediateDirectives,
      logisticsOverview: `Resource depots confirm ${resources.rescueBoats.available} boats and ${resources.personnelRescueTeams.available} rescue teams deployable. Supply water deficit sits at -${(
        resources.potableWaterLiters.required - resources.potableWaterLiters.available
      ).toLocaleString()}L. Primary corridor: ${roads.find((r) => r.status === 'CLEAR')?.name || 'Inland Ridge Bypass'}. (Provider: ${briefReport.providerName})`,
      publicNoticeStatus: `CAP Alert #09 dispatched via geo-targeted cellular broadcast [${briefReport.mode}]. Siren grid activated.`,
    };

    // 4. Synthesize Public Advisory message
    const publicAdvisory = `EMERGENCY CIVIL PROTECTION ADVISORY:
To all residents in ${currentDisaster.location}:
1. EVACUATE IMMEDIATELY if you reside in coastal zones, riverbanks, or low-lying ground.
2. DO NOT attempt to drive across flooded road crossings or bridges.
3. Move toward designated elevated community shelters or inland high ground immediately.
4. Keep emergency radios tuned to 98.4 FM and preserve mobile battery for SOS transmissions.`;

    // 5. Create Emergency Alert item
    const alertItem: EmergencyAlert = {
      id: `alert-${Date.now()}`,
      type: currentRiskLevel === 'CRITICAL' ? 'RED_ALERT' : 'AMBER_ALERT',
      title: `${currentRiskLevel} EMERGENCY DIRECTIVE: ${currentDisaster.name.toUpperCase()}`,
      message: publicAdvisory,
      dispatchedAt: new Date().toISOString(),
      targetZones: [currentDisaster.location, 'Coastal Corridors', 'Riparian Wards'],
    };

    logTrace(
      `Synthesized Tactical Briefing via ${briefReport.providerName} [${briefReport.mode}] (${briefReport.generationTimeMs}ms).`,
      `Multi-agency broadcast dispatches aligned with ${currentRiskLevel} emergency protocols.`,
      0.97
    );

    const commInsight: AIInsight = {
      id: `insight-comm-${Date.now()}`,
      type: 'COMMUNICATION',
      title: `Tactical SITREP & Officer Directives Generated (${briefReport.mode})`,
      description: `Dispatched multi-channel warnings across ${alertItem.targetZones.join(', ')}. Evacuation compliance currently tracking at ${Math.round(
        population.evacuationComplianceRate * 100
      )}%. Provider: ${briefReport.providerName}.`,
      severity: currentRiskLevel,
      timestamp: new Date().toISOString(),
      metrics: {
        alertLevel: alertItem.type,
        targetZonesCount: alertItem.targetZones.length,
        compliancePercent: Math.round(population.evacuationComplianceRate * 100),
        provider: briefReport.providerName,
        mode: briefReport.mode,
      },
      sourceAgent: this.name,
    };

    const commRecommendation: AIRecommendation = {
      id: `rec-comm-push-${Date.now()}`,
      priority: 'IMMEDIATE',
      category: 'COMMUNICATION',
      title: 'Dispatch Recurring High-Priority Cell Broadcasts',
      action: 'Trigger 15-minute recurring wireless emergency alerts (WEA) and emergency radio override broadcasts.',
      impactScoreReduction: 15,
      reasoning: 'Reaching remaining uninformed civilians before telecommunication tower degradation occurs.',
      sourceAgent: this.name,
      confidence: 0.96,
      timestamp: new Date().toISOString(),
    };

    // Commit to Blackboard
    blackboard.updateState((prev) => ({
      officerBrief,
      alerts: [alertItem, ...prev.alerts.slice(0, 5)],
      insights: [...prev.insights.filter((i) => i.sourceAgent !== this.name), commInsight],
      generatedRecommendations: [
        ...prev.generatedRecommendations.filter((r) => r.sourceAgent !== this.name),
        commRecommendation,
      ],
    }));

    blackboard.updateAgentStatus(
      this.name,
      'ONLINE',
      `Officer briefing and SITREP updated via ${briefReport.providerName} [${briefReport.mode}].`
    );
  }
}

