import { useState, useEffect, useCallback } from 'react';
import { aiService } from '../services';
import { WorldState, ReasoningTraceItem, AgentStatusItem } from '../core/WorldState';
import { AIDecisionResult } from '../types';
import { DisasterScenario } from '../scenarios';

export interface UseAIOptions {
  autoFetch?: boolean;
}

export function useAI(options: UseAIOptions = { autoFetch: true }) {
  const blackboard = aiService.getBlackboard();

  const [worldState, setWorldState] = useState<WorldState>(blackboard.getState());
  const [activeScenarioId, setActiveScenarioId] = useState<string>(aiService.getActiveScenarioId());
  const [loading, setLoading] = useState<boolean>(options.autoFetch ?? true);
  const [error, setError] = useState<Error | null>(null);

  // Subscribe to Blackboard shared memory mutations
  useEffect(() => {
    const unsubscribe = blackboard.subscribe((newState) => {
      setWorldState({ ...newState });
    });
    return unsubscribe;
  }, [blackboard]);

  const runAnalysis = useCallback(async (): Promise<AIDecisionResult> => {
    setLoading(true);
    setError(null);
    try {
      const result = await aiService.runFullAnalysis();
      setWorldState(blackboard.getState());
      return result;
    } catch (err: any) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [blackboard]);

  const loadScenario = useCallback(
    async (scenarioId: string) => {
      setLoading(true);
      setError(null);
      try {
        await aiService.loadScenario(scenarioId);
        setActiveScenarioId(scenarioId);
        setWorldState(blackboard.getState());
      } catch (err: any) {
        const e = err instanceof Error ? err : new Error(String(err));
        setError(e);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [blackboard]
  );

  const refresh = useCallback(async () => {
    await runAnalysis();
  }, [runAnalysis]);

  useEffect(() => {
    if (options.autoFetch) {
      runAnalysis().catch((err) => {
        console.error('[useAI] Failed initial analysis execution:', err);
      });
    }
  }, [options.autoFetch, runAnalysis]);

  const scenarios: DisasterScenario[] = aiService.getScenarios();

  return {
    worldState,
    activeScenarioId,
    scenarios,
    loadScenario,
    loading,
    error,
    runAnalysis,
    refresh,

    // Direct computed accessors
    threatLevel: worldState.currentRiskLevel,
    threatScore: worldState.threatScore,
    situationSummary: worldState.situationSummary,
    triggeredRules: worldState.triggeredRules,
    recommendations: worldState.generatedRecommendations,
    priorityActions: worldState.priorityActions,
    officerBrief: worldState.officerBrief,
    insights: worldState.insights,
    timeline: worldState.timeline,
    reasoningTrace: worldState.reasoningTrace as ReasoningTraceItem[],
    agentStatuses: worldState.agentStatuses as Record<string, AgentStatusItem>,
    confidence: worldState.systemConfidence,
    currentDisaster: worldState.currentDisaster,
  };
}
