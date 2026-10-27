import { IBlackboardAgent, AgentExecutionContext } from '../core/AgentContext';
import { AIInsight, AIRecommendation } from '../types';

export class RiskAssessmentAgent implements IBlackboardAgent {
  public readonly name = 'RiskAssessmentAgent';
  public readonly category = 'TACTICAL_RISK_EVALUATION';

  public execute(context: AgentExecutionContext): void {
    const { blackboard, logTrace } = context;
    const state = blackboard.getState();
    const { weather, population, infrastructure, hospitals, currentDisaster } = state;

    blackboard.updateAgentStatus(this.name, 'PROCESSING', 'Evaluating multi-factor threat matrix...');

    let hazardScore = 0;
    let exposureScore = 0;
    let infraFragilityScore = 0;
    let medicalStressScore = 0;

    const reasons: string[] = [];

    // 1. Hazard Factor (Max 35)
    if (weather.rainfallMm >= 200 || weather.windSpeedKmph >= 130 || (weather.stormSurgeMeters ?? 0) >= 2.5) {
      hazardScore += 35;
      reasons.push('Extreme hydrometeorological forces exceeding defensive envelope.');
    } else if (weather.rainfallMm >= 100 || weather.windSpeedKmph >= 80) {
      hazardScore += 24;
      reasons.push('Elevated atmospheric energy threatening exposed civil structures.');
    } else {
      hazardScore += 12;
    }

    if (infrastructure.structuralDamagePercentage >= 20) {
      hazardScore = Math.min(35, hazardScore + 15);
      reasons.push(`Widespread structural building damage across ${infrastructure.structuralDamagePercentage}% of quadrant.`);
    }

    // 2. Exposure & Population Factor (Max 30)
    if (population.densityPerSqKm >= 2000) {
      exposureScore += 16;
      reasons.push(`High human density (${population.densityPerSqKm}/sq km) elevates potential casualty rates.`);
    } else {
      exposureScore += 8;
    }

    if (population.strandedCount >= 300) {
      exposureScore += 14;
      reasons.push(`Critical civilian count stranded in danger zone (${population.strandedCount} persons).`);
    } else if (population.strandedCount > 50) {
      exposureScore += 8;
    }

    // 3. Infrastructure Fragility Factor (Max 20)
    if (infrastructure.bridgesCollapsed > 0) {
      infraFragilityScore += 8;
      reasons.push(`${infrastructure.bridgesCollapsed} bridge span(s) collapsed, creating arterial severance.`);
    }
    if (infrastructure.criticalEmbankmentsBreached > 0) {
      infraFragilityScore += 8;
      reasons.push('Flood protection bund breach allows catastrophic inundation ingress.');
    }
    if (infrastructure.substationsDamaged >= 2 || infrastructure.cellularTowersOffline >= 2) {
      infraFragilityScore += 4;
      reasons.push('Lifeline power and communications infrastructure severely degraded.');
    }

    // 4. Medical Capacity Stress Factor (Max 15)
    if (hospitals.icuBedsAvailable <= 5) {
      medicalStressScore += 8;
      reasons.push(`Acute regional ICU bed depletion (${hospitals.icuBedsAvailable} beds remaining).`);
    }
    if (!hospitals.backupGeneratorsOperational) {
      medicalStressScore += 7;
      reasons.push('Hospital emergency power generators reported non-operational.');
    }

    // Total Threat Score (0 - 100)
    const compositeScore = Math.min(100, hazardScore + exposureScore + infraFragilityScore + medicalStressScore);

    const threatLevel: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW' =
      compositeScore >= 78 ? 'CRITICAL' : compositeScore >= 55 ? 'HIGH' : compositeScore >= 35 ? 'MODERATE' : 'LOW';

    const priorityLevel: 'IMMEDIATE' | 'HIGH_PRIORITY' | 'ADVISORY' =
      compositeScore >= 75 ? 'IMMEDIATE' : compositeScore >= 50 ? 'HIGH_PRIORITY' : 'ADVISORY';

    const confidence = 0.94;

    const synthesizedReasoning = reasons.join(' ');

    logTrace(
      `Computed composite hazard score at ${compositeScore}/100. Threat Level: ${threatLevel}.`,
      synthesizedReasoning,
      confidence
    );

    const riskInsight: AIInsight = {
      id: `insight-risk-${Date.now()}`,
      type: 'RISK',
      title: `${threatLevel} Composite Disaster Risk Score (${compositeScore}/100)`,
      description: synthesizedReasoning,
      severity: threatLevel,
      timestamp: new Date().toISOString(),
      metrics: {
        compositeScore,
        hazardFactor: hazardScore,
        exposureFactor: exposureScore,
        infrastructureFragility: infraFragilityScore,
        medicalStress: medicalStressScore,
      },
      sourceAgent: this.name,
    };

    const riskRecommendation: AIRecommendation = {
      id: `rec-risk-evac-${Date.now()}`,
      priority: priorityLevel,
      category: 'EVACUATION',
      title: `Authorize Tier-1 Incident Command Evacuation Protocols`,
      action: `Authorize full emergency powers under Section 24 for ${currentDisaster.location}; trigger sirens in high-exposure wards.`,
      impactScoreReduction: 28,
      reasoning: synthesizedReasoning,
      sourceAgent: this.name,
      confidence,
      timestamp: new Date().toISOString(),
    };

    // Commit to Blackboard
    blackboard.updateState((prev) => ({
      currentRiskLevel: threatLevel,
      currentPriorityLevel: priorityLevel,
      threatScore: compositeScore,
      systemConfidence: confidence,
      insights: [...prev.insights.filter((i) => i.sourceAgent !== this.name), riskInsight],
      generatedRecommendations: [
        ...prev.generatedRecommendations.filter((r) => r.sourceAgent !== this.name),
        riskRecommendation,
      ],
    }));

    blackboard.updateAgentStatus(
      this.name,
      'ONLINE',
      `Calculated ${threatLevel} Threat Score (${compositeScore}/100) with ${Math.round(confidence * 100)}% confidence.`
    );
  }
}
