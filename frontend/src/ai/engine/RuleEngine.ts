import { AIRule } from '../types';
import { KnowledgeBase } from './KnowledgeBase';
import { WorldState, ReasoningTraceItem } from '../core/WorldState';
import { Blackboard } from '../core/Blackboard';

export interface RuleEvaluationResult {
  triggeredRules: AIRule[];
  reasoningTraces: Omit<ReasoningTraceItem, 'step' | 'timestamp'>[];
  conflictResolutionSummary: string;
}

export class RuleEngine {
  private knowledgeBase: KnowledgeBase;

  constructor(knowledgeBase: KnowledgeBase) {
    this.knowledgeBase = knowledgeBase;
  }

  /**
   * Sets or updates the active knowledge base.
   */
  public setKnowledgeBase(kb: KnowledgeBase): void {
    this.knowledgeBase = kb;
  }

  /**
   * Executes Forward-Chaining deduction against the provided WorldState or Blackboard.
   * Dynamically evaluates all rules in the KnowledgeBase, resolves conflicts, and appends reasoning traces.
   */
  public evaluate(stateOrBlackboard: WorldState | Blackboard): RuleEvaluationResult {
    const state = stateOrBlackboard instanceof Blackboard ? stateOrBlackboard.getState() : stateOrBlackboard;
    const blackboard = stateOrBlackboard instanceof Blackboard ? stateOrBlackboard : null;

    const allRules = this.knowledgeBase.getAllRules();
    const candidateRules: AIRule[] = [];
    const reasoningTraces: Omit<ReasoningTraceItem, 'step' | 'timestamp'>[] = [];

    // Phase 1: Forward-chaining condition evaluation
    for (const rule of allRules) {
      try {
        const isTriggered = rule.condition(state);
        if (isTriggered) {
          candidateRules.push(rule);

          const traceItem = {
            source: `RuleEngine [${rule.id}]`,
            category: rule.category,
            observation: rule.description,
            inference: rule.explanation,
            confidence: rule.confidence,
          };
          reasoningTraces.push(traceItem);

          if (blackboard) {
            blackboard.addReasoningTrace(traceItem);
          }
        }
      } catch (err) {
        console.warn(`[RuleEngine] Error evaluating rule ${rule.id}:`, err);
      }
    }

    // Phase 2: Conflict Resolution
    // Rules are resolved using Priority-Weight Salience and Specificity
    const resolvedRules = this.resolveConflicts(candidateRules);

    const conflictResolutionSummary =
      candidateRules.length > resolvedRules.length
        ? `Resolved ${candidateRules.length - resolvedRules.length} conflicting/redundant directives based on priority salience.`
        : `All ${resolvedRules.length} triggered rules resolved without mutual exclusion conflicts.`;

    // Write triggered rules back to Blackboard if available
    if (blackboard) {
      blackboard.updateState({
        triggeredRules: resolvedRules,
      });
    }

    return {
      triggeredRules: resolvedRules,
      reasoningTraces,
      conflictResolutionSummary,
    };
  }

  /**
   * Resolves conflicts among triggered rules using priority salience and category deduplication.
   */
  private resolveConflicts(rules: AIRule[]): AIRule[] {
    // 1. Sort by priorityWeight descending, then confidence descending
    const sorted = [...rules].sort((a, b) => {
      if (b.priorityWeight !== a.priorityWeight) {
        return b.priorityWeight - a.priorityWeight;
      }
      return (b.confidence ?? 0.9) - (a.confidence ?? 0.9);
    });

    // 2. Filter out contradictory directives (e.g. contradictory actions in same category)
    const seenActionTitles = new Set<string>();
    const deduplicated: AIRule[] = [];

    for (const rule of sorted) {
      const titleKey = rule.action.recommendationTitle.toLowerCase().trim();
      if (!seenActionTitles.has(titleKey)) {
        seenActionTitles.add(titleKey);
        deduplicated.push(rule);
      }
    }

    return deduplicated;
  }
}
