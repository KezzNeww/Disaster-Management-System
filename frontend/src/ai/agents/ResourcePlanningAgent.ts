import { IBlackboardAgent, AgentExecutionContext } from '../core/AgentContext';
import { AIInsight, AIRecommendation } from '../types';

export class ResourcePlanningAgent implements IBlackboardAgent {
  public readonly name = 'ResourcePlanningAgent';
  public readonly category = 'LOGISTICS_AND_SUPPLY';

  public execute(context: AgentExecutionContext): void {
    const { blackboard, logTrace } = context;
    const state = blackboard.getState();
    const { resources, population, shelters } = state;

    blackboard.updateAgentStatus(this.name, 'PROCESSING', 'Auditing resource inventories and logistical demand...');

    const recommendations: AIRecommendation[] = [];
    const insights: AIInsight[] = [];

    // 1. Food Rations Audit
    const foodDeficit = resources.foodRationsKits.required - resources.foodRationsKits.available;
    if (foodDeficit > 0) {
      logTrace(
        `Food ration inventory deficit of ${foodDeficit.toLocaleString()} rations detected.`,
        'Immediate bulk dispatch required to avert emergency shelter starvation within 48 hours.',
        0.93
      );
      recommendations.push({
        id: `rec-res-food-${Date.now()}`,
        priority: foodDeficit > 5000 ? 'IMMEDIATE' : 'HIGH_PRIORITY',
        category: 'SUPPLY_CHAIN',
        title: `Mobilize Emergency Strategic Food Cache (+${foodDeficit.toLocaleString()} Rations)`,
        action: `Requisition and deploy ${foodDeficit.toLocaleString()} ready-to-eat meal rations from Central Food Warehouses via dedicated relief transport.`,
        impactScoreReduction: 16,
        reasoning: `Current stock (${resources.foodRationsKits.available.toLocaleString()}) covers only ${Math.round(
          (resources.foodRationsKits.available / Math.max(1, resources.foodRationsKits.required)) * 100
        )}% of affected population baseline.`,
        sourceAgent: this.name,
        confidence: 0.94,
        timestamp: new Date().toISOString(),
      });
    }

    // 2. Potable Water Audit
    const waterDeficit = resources.potableWaterLiters.required - resources.potableWaterLiters.available;
    if (waterDeficit > 0) {
      logTrace(
        `Potable water deficit of ${waterDeficit.toLocaleString()} liters calculated.`,
        'High dehydration risk in evacuation centers; municipal water contamination suspected.',
        0.96
      );
      recommendations.push({
        id: `rec-res-water-${Date.now()}`,
        priority: 'IMMEDIATE',
        category: 'SUPPLY_CHAIN',
        title: `Deploy Mobile Water Tankers & Purification Skids (+${waterDeficit.toLocaleString()} L)`,
        action: `Direct municipal water bowsers and deploy 8 reverse-osmosis purification trailers to active distribution hubs.`,
        impactScoreReduction: 20,
        reasoning: `Severe potable water deficit threatens public hygiene and risks dehydration across crowded shelter points.`,
        sourceAgent: this.name,
        confidence: 0.96,
        timestamp: new Date().toISOString(),
      });
    }

    // 3. Medical Kits & Trauma Packs
    const medDeficit = resources.emergencyMedicalKits.required - resources.emergencyMedicalKits.available;
    if (medDeficit > 0) {
      recommendations.push({
        id: `rec-res-med-${Date.now()}`,
        priority: 'HIGH_PRIORITY',
        category: 'RESOURCES',
        title: `Dispatch Emergency Trauma & Pediatric Kits (+${medDeficit} Units)`,
        action: `Air-deliver trauma response kits, saline bags, and burn dressings to forward field hospitals.`,
        impactScoreReduction: 18,
        reasoning: `Field surgical and wound dressing capacity is deficient by ${medDeficit} comprehensive medical kits.`,
        sourceAgent: this.name,
        confidence: 0.92,
        timestamp: new Date().toISOString(),
      });
    }

    // 4. Rescue Teams & Boat Fleet Allocation
    const neededRescueTeams = Math.ceil(population.strandedCount / 30);
    const availableTeams = resources.personnelRescueTeams.available;
    if (availableTeams < neededRescueTeams) {
      const teamDeficit = neededRescueTeams - availableTeams;
      logTrace(
        `Rescue team shortage: ${availableTeams} available vs ${neededRescueTeams} needed for ${population.strandedCount} stranded victims.`,
        'Mutual aid mobilization from national disaster forces required immediately.',
        0.95
      );
      recommendations.push({
        id: `rec-res-teams-${Date.now()}`,
        priority: 'IMMEDIATE',
        category: 'RESOURCES',
        title: `Mobilize Mutual Aid Rescue Teams (+${teamDeficit} Platoons)`,
        action: `Requisition ${teamDeficit} specialized swift-water/urban search-and-rescue teams from adjacent military divisions.`,
        impactScoreReduction: 25,
        reasoning: `Extraction of ${population.strandedCount} stranded individuals exceeds current local personnel capacity by ${teamDeficit} teams.`,
        sourceAgent: this.name,
        confidence: 0.95,
        timestamp: new Date().toISOString(),
      });
    }

    // 5. Emergency Shelters Capacity
    const occupancyRate = shelters.totalCapacity > 0 ? shelters.currentOccupancy / shelters.totalCapacity : 0;
    if (occupancyRate >= 0.85) {
      logTrace(
        `Shelter capacity at ${Math.round(occupancyRate * 100)}% (${shelters.currentOccupancy}/${shelters.totalCapacity}).`,
        'Shelter saturation risk imminent; overflow staging required.',
        0.91
      );
      recommendations.push({
        id: `rec-res-shelter-${Date.now()}`,
        priority: 'HIGH_PRIORITY',
        category: 'RESOURCES',
        title: 'Activate Secondary Overflow Shelters & Indoor Arenas',
        action: 'Designate secondary school gymnasiums and exhibition centers to accommodate expected overflow evacuees.',
        impactScoreReduction: 17,
        reasoning: `Existing shelters have absorbed ${Math.round(occupancyRate * 100)}% of max safe occupancy.`,
        sourceAgent: this.name,
        confidence: 0.93,
        timestamp: new Date().toISOString(),
      });
    }

    // 6. Ambulance Fleet Capacity
    if (resources.ambulances.available <= 5) {
      recommendations.push({
        id: `rec-res-ambulance-${Date.now()}`,
        priority: 'IMMEDIATE',
        category: 'MEDICAL',
        title: 'Emergency Medical Evacuation Mutual Aid Callout',
        action: 'Call in private paramedic contractors and military field ambulances to sustain patient transports.',
        impactScoreReduction: 19,
        reasoning: `Only ${resources.ambulances.available} ambulances remain uncommitted across entire incident theater.`,
        sourceAgent: this.name,
        confidence: 0.95,
        timestamp: new Date().toISOString(),
      });
    }

    insights.push({
      id: `insight-res-summary-${Date.now()}`,
      type: 'RESOURCE',
      title: 'Resource Balance & Critical Deficits Audit',
      description: `Identified deficits: Water (-${waterDeficit.toLocaleString()}L), Food (-${foodDeficit.toLocaleString()} pkts), Shelters (${Math.round(
        occupancyRate * 100
      )}% full).`,
      severity: occupancyRate >= 0.9 || waterDeficit > 10000 ? 'CRITICAL' : 'HIGH',
      timestamp: new Date().toISOString(),
      metrics: {
        waterDeficitLiters: waterDeficit,
        foodDeficitKits: foodDeficit,
        shelterOccupancyPercent: Math.round(occupancyRate * 100),
        rescueTeamsAvailable: availableTeams,
      },
      sourceAgent: this.name,
    });

    // Write to Blackboard
    blackboard.updateState((prev) => ({
      insights: [...prev.insights.filter((i) => i.sourceAgent !== this.name), ...insights],
      generatedRecommendations: [
        ...prev.generatedRecommendations.filter((r) => r.sourceAgent !== this.name),
        ...recommendations,
      ],
    }));

    blackboard.updateAgentStatus(
      this.name,
      'ONLINE',
      `Audit complete. Generated ${recommendations.length} resource mobilization directives.`
    );
  }
}
