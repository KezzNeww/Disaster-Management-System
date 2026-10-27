export interface FeatureImportanceItem {
  featureName: string;
  weight: number; // 0.0 - 1.0
  impactType: 'INCREASING_RISK' | 'MITIGATING';
  description: string;
}

export interface PredictionTimelinePoint {
  timeOffset: string; // "+2 Hours", "+6 Hours", etc.
  projectedSeverity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  inundationAreaSqKm: number;
  evacuationUrgency: number; // 0 - 100
  casualtyRiskIndex: number;
}

export interface AIRecommendation {
  id: string;
  priority: 'IMMEDIATE' | 'HIGH_PRIORITY' | 'ADVISORY';
  category: 'EVACUATION' | 'INFRASTRUCTURE' | 'SUPPLY_CHAIN' | 'COMMUNICATION';
  title: string;
  action: string;
  impactScoreReduction: number;
}

export interface AIPredictionProfile {
  disasterId: string;
  disasterName: string;
  modelVersion: string;
  calculatedRiskScore: number;
  confidenceScore: number;
  primaryHazardDrivers: string[];
  reasoningSummary: string;
  deepNeuralAnalysis: string;
  features: FeatureImportanceItem[];
  timeline: PredictionTimelinePoint[];
  recommendations: AIRecommendation[];
}

export type AIPredictionResult = AIPredictionProfile;
