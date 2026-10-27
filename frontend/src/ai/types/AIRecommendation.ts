export type RecommendationPriority =
  | 'IMMEDIATE'
  | 'HIGH_PRIORITY'
  | 'ADVISORY'
  | 'CRITICAL'
  | 'HIGH'
  | 'MEDIUM'
  | 'LOW';

export type RecommendationCategory =
  | 'EVACUATION'
  | 'INFRASTRUCTURE'
  | 'SUPPLY_CHAIN'
  | 'COMMUNICATION'
  | 'RESOURCES'
  | 'WEATHER'
  | 'MEDICAL'
  | 'HAZMAT';

export interface AIRecommendation {
  id: string;
  priority: RecommendationPriority;
  category: RecommendationCategory;
  title: string;
  action: string;
  impactScoreReduction?: number;
  reasoning?: string;
  sourceAgent?: string;
  confidence?: number;
  timestamp?: string;
}
