import { IBlackboardAgent, AgentExecutionContext } from '../core/AgentContext';
import { AIInsight, AIRecommendation } from '../types';
import { RoadConditionItem } from '../core/WorldState';

export interface RoutePlanningSynthesis {
  blockedRoutes: RoadConditionItem[];
  unsafeAreas: string[];
  primarySafeRoute: RoadConditionItem | null;
  alternativeSafeRoute: RoadConditionItem | null;
  estimatedDelayMinutes: number;
  reasoning: string;
}

export class RoutePlanningAgent implements IBlackboardAgent {
  public readonly name = 'RoutePlanningAgent';
  public readonly category = 'TRANSIT_AND_CORRIDOR_SAFETY';

  public execute(context: AgentExecutionContext): void {
    const { blackboard, logTrace } = context;
    const state = blackboard.getState();
    const { roads, traffic, infrastructure } = state;

    blackboard.updateAgentStatus(this.name, 'PROCESSING', 'Analyzing corridor clearances and bottleneck impedances...');

    // 1. Identify Blocked and Impassable Segments
    const blockedRoutes = roads.filter(
      (r) => r.status === 'IMPASSABLE' || (r.waterDepthMeters ?? 0) >= 0.5
    );

    // 2. Find Clear, High-Elevation Safe Routes
    const clearRoutes = roads
      .filter((r) => r.status === 'CLEAR' || (r.status === 'FLOOD_WARNING' && (r.waterDepthMeters ?? 0) < 0.2))
      .sort((a, b) => b.elevationMeters - a.elevationMeters);

    const primarySafeRoute = clearRoutes[0] || null;

    // 4. Calculate Delay Impedance
    const baselineSpeed = 60;
    const currentSpeed = Math.max(10, traffic.averageSpeedKmph);
    const speedRatio = baselineSpeed / currentSpeed;
    const estimatedDelayMinutes = Math.round((speedRatio - 1) * 35) + (traffic.gridlockOnEvacuationRoutes ? 45 : 10);

    const unsafeAreas: string[] = [];
    if (infrastructure.bridgesCollapsed > 0) unsafeAreas.push('River Bridge Crossings (Span Structural Instability)');
    if (blockedRoutes.length > 0) unsafeAreas.push(...blockedRoutes.map((r) => `${r.name} (${r.blockedReason || 'Inundated'})`));

    const routeReasoning =
      blockedRoutes.length > 0
        ? `${blockedRoutes.length} key transit segment(s) severed or submerged (${blockedRoutes.map((r) => r.name).join(', ')}). Rerouting traffic across high-elevation corridor ${primarySafeRoute?.name || 'Inland Ridgeline'} avoids low-lying chokepoints and provides +${primarySafeRoute?.elevationMeters || 12}m topographic water clearance.`
        : `Corridor network operational with localized congestion on urban feeder segments. ${primarySafeRoute?.name || 'Main Highway'} remains primary axis.`;

    logTrace(
      `Detected ${blockedRoutes.length} blocked route(s) and ${traffic.chokepointsIdentified.length} bottleneck chokepoints.`,
      routeReasoning,
      0.95
    );

    const insights: AIInsight[] = [
      {
        id: `insight-route-clearance-${Date.now()}`,
        type: 'ROUTE',
        title: `Corridor Accessibility Audit: ${blockedRoutes.length} Blocked / ${clearRoutes.length} Viable`,
        description: routeReasoning,
        severity: blockedRoutes.length > 0 ? 'HIGH' : 'INFO',
        timestamp: new Date().toISOString(),
        metrics: {
          blockedCount: blockedRoutes.length,
          clearCount: clearRoutes.length,
          estimatedDelayMinutes,
          averageSpeedKmph: traffic.averageSpeedKmph,
        },
        sourceAgent: this.name,
      },
    ];

    const recommendations: AIRecommendation[] = [];

    if (primarySafeRoute && blockedRoutes.length > 0) {
      recommendations.push({
        id: `rec-route-reroute-${Date.now()}`,
        priority: 'IMMEDIATE',
        category: 'INFRASTRUCTURE',
        title: `Designate ${primarySafeRoute.name} as Primary Safe Evacuation Spine`,
        action: `Close ingress onto blocked corridors (${blockedRoutes.map((r) => r.name).join(', ')}) and steer all mass transit columns via ${primarySafeRoute.name}.`,
        impactScoreReduction: 22,
        reasoning: routeReasoning,
        sourceAgent: this.name,
        confidence: 0.95,
        timestamp: new Date().toISOString(),
      });
    }

    if (traffic.gridlockOnEvacuationRoutes || traffic.overallCongestionLevel === 'CRITICAL') {
      recommendations.push({
        id: `rec-route-contraflow-${Date.now()}`,
        priority: 'HIGH_PRIORITY',
        category: 'INFRASTRUCTURE',
        title: 'Activate Emergency Contraflow & Highway Tow Clearing',
        action: 'Convert inbound lanes to outbound on main arterial corridors to halve projected traffic delay (+45 min reduction).',
        impactScoreReduction: 18,
        reasoning: `Severe chokepoints on evacuation corridors (${traffic.chokepointsIdentified.join(', ')}) threaten to stall escaping vehicles.`,
        sourceAgent: this.name,
        confidence: 0.93,
        timestamp: new Date().toISOString(),
      });
    }

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
      `Identified ${clearRoutes.length} clear routes. Primary Safe Axis: ${primarySafeRoute?.name || 'Inland Ridge'}. Estimated Delay: ${estimatedDelayMinutes} min.`
    );
  }
}
