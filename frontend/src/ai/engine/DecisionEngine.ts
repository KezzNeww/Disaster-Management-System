import {
  AIDecisionResult,
  AIRecommendation,
  AIRule,
  AIPredictionTimelineItem,
  RecommendationPriority,
} from '../types';
import { WorldState } from '../core/WorldState';
import { Blackboard } from '../core/Blackboard';

export interface ResponsePlanPhase {
  phaseNumber: number;
  phaseName: string;
  timeframe: string;
  focus: string;
  keyDirectives: string[];
}

export class DecisionEngine {
  /**
   * Evaluates the Blackboard shared memory state, merges recommendations from all agents
   * and expert rules, deduplicates, prioritizes, and writes the synthesized AIDecisionResult back to Blackboard.
   */
  public synthesize(stateOrBlackboard: WorldState | Blackboard): AIDecisionResult {
    const state = stateOrBlackboard instanceof Blackboard ? stateOrBlackboard.getState() : stateOrBlackboard;
    const blackboard = stateOrBlackboard instanceof Blackboard ? stateOrBlackboard : null;

    // 1. Gather recommendations from Blackboard (Agent outputs + Rule actions)
    const agentRecommendations = state.generatedRecommendations || [];
    const ruleRecommendations = this.convertTriggeredRulesToRecommendations(state.triggeredRules || []);

    const combined = [...agentRecommendations, ...ruleRecommendations];

    // 2. Deduplicate recommendations
    const uniqueRecommendations = this.deduplicateRecommendations(combined);

    // 3. Rank recommendations by priority and impact
    const rankedRecommendations = this.rankRecommendations(uniqueRecommendations);

    // 4. Extract top priority action directives
    const priorityActions = rankedRecommendations
      .filter((rec) => rec.priority === 'IMMEDIATE' || rec.priority === 'CRITICAL' || rec.priority === 'HIGH_PRIORITY')
      .slice(0, 6)
      .map((rec) => rec.action);

    // 5. Calculate composite system confidence
    const confidence = this.computeCompositeConfidence(rankedRecommendations, state.triggeredRules);

    // 6. Generate rich Situation Summary
    const situationSummary = this.synthesizeSituationSummary(state);

    // 7. Generate Predictive Decision Timeline
    const timeline = this.generatePredictiveTimeline(state);

    const decision: AIDecisionResult = {
      situationSummary,
      threatLevel: state.currentRiskLevel || 'HIGH',
      confidence,
      triggeredRules: state.triggeredRules || [],
      recommendations: rankedRecommendations,
      priorityActions,
      officerBrief: state.officerBrief,
      insights: state.insights || [],
      timeline,
      generatedAt: new Date().toISOString(),
    };

    // Commit final synthesis back to Blackboard
    if (blackboard) {
      blackboard.updateState({
        situationSummary,
        systemConfidence: confidence,
        generatedRecommendations: rankedRecommendations,
        priorityActions,
        timeline,
      });

      blackboard.addReasoningTrace({
        source: 'DecisionEngine',
        category: 'DECISION_SYNTHESIS',
        observation: `Consolidated ${rankedRecommendations.length} unique recommendations and ${state.triggeredRules.length} active expert rules.`,
        inference: `Overall system threat verified at ${state.currentRiskLevel} (${state.threatScore}/100) with ${Math.round(
          confidence * 100
        )}% consensus confidence.`,
        confidence,
      });
    }

    return decision;
  }

  /**
   * Synthesizes an executive narrative from the World State.
   */
  private synthesizeSituationSummary(state: WorldState): string {
    const { currentDisaster, weather, population, infrastructure, currentRiskLevel, threatScore } = state;
    return `INCIDENT OVERVIEW: ${currentDisaster.name} (${currentDisaster.type}) active across ${
      currentDisaster.location
    }. Operational Threat Level evaluated at ${currentRiskLevel} [Index: ${threatScore}/100]. Environmental forces record ${
      weather.windSpeedKmph
    } km/h sustained gusts, ${weather.rainfallMm}mm precipitation, and ${
      weather.stormSurgeMeters ? `+${weather.stormSurgeMeters}m surge` : 'riverine inundation'
    }. Total affected population sits at ${population.totalAffected.toLocaleString()} with ${population.strandedCount.toLocaleString()} individuals in high-risk zones. ${
      infrastructure.bridgesCollapsed > 0 ? `Critical infrastructure compromised with ${infrastructure.bridgesCollapsed} bridge span down.` : 'Primary highway networks operational under heavy congestion.'
    }`;
  }

  /**
   * Converts triggered Expert System rules into prioritized recommendations.
   */
  private convertTriggeredRulesToRecommendations(rules: AIRule[]): AIRecommendation[] {
    return rules.map((rule) => ({
      id: `rule-rec-${rule.id}`,
      priority: rule.action.priority || rule.priority || 'HIGH_PRIORITY',
      category: rule.action.recommendationCategory || 'INFRASTRUCTURE',
      title: rule.action.recommendationTitle || rule.title,
      action: rule.action.action || rule.description,
      impactScoreReduction: rule.action.impactScoreReduction || 15,
      reasoning: `Expert Rule [${rule.id}]: ${rule.explanation}`,
      sourceAgent: 'RuleEngine',
      confidence: rule.confidence || 0.95,
      timestamp: new Date().toISOString(),
    }));
  }

  /**
   * Deduplicates recommendations based on action title and intent.
   */
  private deduplicateRecommendations(recommendations: AIRecommendation[]): AIRecommendation[] {
    const map = new Map<string, AIRecommendation>();

    for (const rec of recommendations) {
      const key = rec.title.toLowerCase().trim();
      const existing = map.get(key);

      if (!existing) {
        map.set(key, rec);
      } else {
        const existingPriority = this.getPriorityWeight(existing.priority);
        const newPriority = this.getPriorityWeight(rec.priority);

        if (
          newPriority > existingPriority ||
          (newPriority === existingPriority && (rec.impactScoreReduction || 0) > (existing.impactScoreReduction || 0))
        ) {
          map.set(key, rec);
        }
      }
    }

    return Array.from(map.values());
  }

  /**
   * Ranks recommendations by priority weight descending, then impact score reduction descending.
   */
  private rankRecommendations(recommendations: AIRecommendation[]): AIRecommendation[] {
    return [...recommendations].sort((a, b) => {
      const weightA = this.getPriorityWeight(a.priority);
      const weightB = this.getPriorityWeight(b.priority);
      if (weightB !== weightA) {
        return weightB - weightA;
      }
      return (b.impactScoreReduction || 0) - (a.impactScoreReduction || 0);
    });
  }

  private getPriorityWeight(priority: RecommendationPriority): number {
    switch (priority) {
      case 'IMMEDIATE':
      case 'CRITICAL':
        return 4;
      case 'HIGH_PRIORITY':
      case 'HIGH':
        return 3;
      case 'MEDIUM':
        return 2;
      case 'ADVISORY':
      case 'LOW':
      default:
        return 1;
    }
  }

  /**
   * Computes multi-agent consensus confidence.
   */
  private computeCompositeConfidence(recommendations: AIRecommendation[], rules: AIRule[]): number {
    const allScores: number[] = [
      ...recommendations.map((r) => r.confidence ?? 0.9),
      ...rules.map((r) => r.confidence ?? 0.95),
    ];
    if (allScores.length === 0) return 0.93;
    const avg = allScores.reduce((sum, s) => sum + s, 0) / allScores.length;
    return Math.round(avg * 100) / 100;
  }

  /**
   * Generates a 4-phase staged emergency response operational plan.
   */
  public generateResponsePlan(state: WorldState, recommendations: AIRecommendation[]): ResponsePlanPhase[] {
    return [
      {
        phaseNumber: 1,
        phaseName: 'Immediate Life Safety & Mandatory Egress',
        timeframe: 'T + 0h to T + 4h',
        focus: 'Civilian extraction, siren alerting, and evacuation corridor control.',
        keyDirectives: recommendations
          .filter((r) => r.category === 'EVACUATION' || r.category === 'COMMUNICATION')
          .slice(0, 3)
          .map((r) => r.action),
      },
      {
        phaseNumber: 2,
        phaseName: 'Route Stabilization & Medical Airlift',
        timeframe: 'T + 4h to T + 12h',
        focus: 'Contraflow management, trauma patient transfers, and utility backup.',
        keyDirectives: recommendations
          .filter((r) => r.category === 'INFRASTRUCTURE' || r.category === 'MEDICAL')
          .slice(0, 3)
          .map((r) => r.action),
      },
      {
        phaseNumber: 3,
        phaseName: 'Logistical Resupply & Sustenance Caching',
        timeframe: 'T + 12h to T + 24h',
        focus: 'Water purification skids, emergency food kits, and shelter overflow.',
        keyDirectives: recommendations
          .filter((r) => r.category === 'SUPPLY_CHAIN' || r.category === 'RESOURCES')
          .slice(0, 3)
          .map((r) => r.action),
      },
      {
        phaseNumber: 4,
        phaseName: 'Damage Assessment & Recovery Transition',
        timeframe: 'T + 24h to T + 48h',
        focus: 'Structural clearance, electrical grid reconnection, and all-clear audits.',
        keyDirectives: [
          'Conduct drone aerial thermographic surveys of damaged infrastructure',
          'Inspect and certify municipal water quality before clearing drinking mains',
          'De-escalate emergency warning sirens and transition to recovery assistance centers',
        ],
      },
    ];
  }

  private generatePredictiveTimeline(state: WorldState): AIPredictionTimelineItem[] {
    const isCritical = state.currentRiskLevel === 'CRITICAL' || state.threatScore >= 75;
    return [
      {
        timeOffset: 'T + 0h (Current)',
        projectedSeverity: isCritical ? 'HIGH' : 'MODERATE',
        impactFactor: state.threatScore,
        evacuationUrgencyPercent: Math.min(100, Math.round(state.threatScore * 0.95)),
        description: `${state.currentDisaster.name} active forces impacting ${state.currentDisaster.location}. Wind at ${state.weather.windSpeedKmph} km/h with active flood warnings.`,
      },
      {
        timeOffset: 'T + 3h',
        projectedSeverity: isCritical ? 'CRITICAL' : 'HIGH',
        impactFactor: Math.min(100, state.threatScore + 10),
        evacuationUrgencyPercent: isCritical ? 98 : 75,
        description: 'Anticipated peak hydrologic surge & wind shear. Secondary road network submersion projected.',
      },
      {
        timeOffset: 'T + 6h',
        projectedSeverity: isCritical ? 'CRITICAL' : 'HIGH',
        impactFactor: Math.min(100, state.threatScore + 5),
        evacuationUrgencyPercent: isCritical ? 90 : 65,
        description: 'Eye / core passage complete; transition to high volume runoff and localized landslide risk.',
      },
      {
        timeOffset: 'T + 18h',
        projectedSeverity: 'MODERATE',
        impactFactor: Math.max(30, state.threatScore - 35),
        evacuationUrgencyPercent: 35,
        description: 'Atmospheric forces subside. Mass urban search-and-rescue and relief convoy deliveries underway.',
      },
    ];
  }
}
