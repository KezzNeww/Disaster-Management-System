import { AIRule } from './AIRule';
import { AIRecommendation } from './AIRecommendation';
import { AIInsight } from './AIInsight';

export * from './AIRule';
export * from './AIRecommendation';
export * from './AIInsight';

export interface AIOfficerBrief {
  executiveSummary: string;
  keyThreats: string[];
  immediateDirectives: string[];
  logisticsOverview: string;
  publicNoticeStatus: string;
}

export interface AIPredictionTimelineItem {
  timeOffset: string;
  projectedSeverity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  impactFactor: number;
  evacuationUrgencyPercent: number;
  description: string;
}

export interface AIDecisionResult {
  situationSummary: string;
  threatLevel: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  confidence: number;
  triggeredRules: AIRule[];
  recommendations: AIRecommendation[];
  priorityActions: string[];
  officerBrief: AIOfficerBrief;
  insights: AIInsight[];
  timeline: AIPredictionTimelineItem[];
  generatedAt: string;
}
