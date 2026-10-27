import { Blackboard } from '../core/Blackboard';
import { AgentExecutionContext, IBlackboardAgent } from '../core/AgentContext';
import {
  WeatherAgent,
  RiskAssessmentAgent,
  ResourcePlanningAgent,
  RoutePlanningAgent,
  CommunicationAgent,
} from '../agents';
import { KnowledgeBase, RuleEngine, DecisionEngine } from '../engine';
import { AIDecisionResult } from '../types';
import { disasterScenarios, DisasterScenario } from '../scenarios';

export class AIService {
  private blackboard: Blackboard;
  private weatherAgent: WeatherAgent;
  private riskAgent: RiskAssessmentAgent;
  private resourceAgent: ResourcePlanningAgent;
  private routeAgent: RoutePlanningAgent;
  private communicationAgent: CommunicationAgent;

  private knowledgeBase: KnowledgeBase;
  private ruleEngine: RuleEngine;
  private decisionEngine: DecisionEngine;

  private activeScenarioId: string;

  constructor(initialScenarioIndex: number = 0) {
    const defaultScenario = disasterScenarios[initialScenarioIndex] || disasterScenarios[0];
    this.activeScenarioId = defaultScenario.id;
    this.blackboard = new Blackboard(defaultScenario.initialState);

    this.weatherAgent = new WeatherAgent();
    this.riskAgent = new RiskAssessmentAgent();
    this.resourceAgent = new ResourcePlanningAgent();
    this.routeAgent = new RoutePlanningAgent();
    this.communicationAgent = new CommunicationAgent();

    this.knowledgeBase = new KnowledgeBase();
    this.ruleEngine = new RuleEngine(this.knowledgeBase);
    this.decisionEngine = new DecisionEngine();
  }

  /**
   * Switches the active disaster scenario in the Blackboard and runs a fresh analysis cycle.
   */
  public async loadScenario(scenarioId: string): Promise<AIDecisionResult> {
    const scenario = disasterScenarios.find((s) => s.id === scenarioId);
    if (!scenario) {
      throw new Error(`Scenario with id "${scenarioId}" not found.`);
    }

    this.activeScenarioId = scenario.id;
    this.blackboard.setState(scenario.initialState);
    return this.runFullAnalysis();
  }

  /**
   * Returns all available disaster scenarios.
   */
  public getScenarios(): DisasterScenario[] {
    return disasterScenarios;
  }

  /**
   * Returns active scenario ID.
   */
  public getActiveScenarioId(): string {
    return this.activeScenarioId;
  }

  /**
   * Coordinates the multi-agent Blackboard execution cycle:
   * Blackboard (Shared Memory)
   *   -> WeatherAgent (Writes atmospheric telemetry)
   *   -> RiskAssessmentAgent (Writes multi-factor hazard score)
   *   -> ResourcePlanningAgent (Writes supply deficits & allocations)
   *   -> RoutePlanningAgent (Writes route clearances & bypasses)
   *   -> CommunicationAgent (Writes tactical officer brief & SITREP)
   *   -> RuleEngine (Forward-chaining deduction & conflict resolution)
   *   -> DecisionEngine (Consolidation, deduplication, ranking & response plan)
   *   -> Final Decision written back to Blackboard.
   */
  public async runFullAnalysis(): Promise<AIDecisionResult> {
    this.blackboard.clearTrace();

    this.blackboard.addReasoningTrace({
      source: 'AIService Orchestrator',
      category: 'CYCLE_INIT',
      observation: `Initiating multi-agent cognitive blackboard reasoning cycle for scenario "${this.activeScenarioId}".`,
      inference: 'Shared memory reset; forward-chaining pipeline activated.',
      confidence: 1.0,
    });

    const agents: IBlackboardAgent[] = [
      this.weatherAgent,
      this.riskAgent,
      this.resourceAgent,
      this.routeAgent,
      this.communicationAgent,
    ];

    // Execute each Blackboard agent
    for (const agent of agents) {
      const context: AgentExecutionContext = {
        agentName: agent.name,
        category: agent.category,
        blackboard: this.blackboard,
        logTrace: (observation, inference, confidence) => {
          this.blackboard.addReasoningTrace({
            source: agent.name,
            category: agent.category,
            observation,
            inference,
            confidence,
          });
        },
      };

      await agent.execute(context);
    }

    // Evaluate Expert Rules via forward chaining
    this.ruleEngine.evaluate(this.blackboard);

    // Final Decision Engine synthesis
    const finalDecision = this.decisionEngine.synthesize(this.blackboard);

    return finalDecision;
  }

  public getBlackboard(): Blackboard {
    return this.blackboard;
  }

  public getKnowledgeBase(): KnowledgeBase {
    return this.knowledgeBase;
  }

  public getRuleEngine(): RuleEngine {
    return this.ruleEngine;
  }

  public getDecisionEngine(): DecisionEngine {
    return this.decisionEngine;
  }
}

// Global singleton instance
export const aiService = new AIService();
