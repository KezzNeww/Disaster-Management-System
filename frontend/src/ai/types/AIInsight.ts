export type InsightSeverity = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW' | 'INFO';

export type InsightCategory =
  | 'WEATHER'
  | 'RISK'
  | 'RESOURCE'
  | 'ROUTE'
  | 'COMMUNICATION';

export interface AIInsight {
  id: string;
  type: InsightCategory;
  title: string;
  description: string;
  severity: InsightSeverity;
  timestamp: string;
  metrics?: Record<string, any>;
  sourceAgent?: string;
}
