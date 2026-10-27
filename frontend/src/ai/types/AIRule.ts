import { WorldState } from '../core/WorldState';
import { RecommendationCategory, RecommendationPriority } from './AIRecommendation';

export type RulePriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type RuleCategory =
  | 'FLOOD'
  | 'CYCLONE'
  | 'WILDFIRE'
  | 'EARTHQUAKE'
  | 'INFRASTRUCTURE'
  | 'MEDICAL'
  | 'EVACUATION'
  | 'RESOURCES'
  | 'TRAFFIC'
  | 'WEATHER'
  | 'HAZMAT';

export type RuleConditionFn = (state: WorldState) => boolean;

export interface AIRuleAction {
  recommendationTitle: string;
  recommendationCategory: RecommendationCategory;
  action: string;
  impactScoreReduction?: number;
  priority?: RecommendationPriority;
  directives?: string[];
}

export interface AIRule {
  id: string;
  title: string;
  description: string;
  category: RuleCategory;
  priorityWeight: number; // 1 - 100 numeric weight for conflict resolution
  priority: RulePriority;
  condition: RuleConditionFn;
  action: AIRuleAction;
  explanation: string; // Human-readable explanation for XAI reasoning trace
  confidence: number; // 0.0 - 1.0
}
