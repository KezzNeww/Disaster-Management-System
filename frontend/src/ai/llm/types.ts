/**
 * Core type definitions for the Hybrid Generative AI Communication Layer.
 * All operational decisions, risk assessments, and routes remain strictly
 * within the Expert System. Generative AI only articulates structured facts into reports.
 */

export type ReportType =
  | 'OFFICER_BRIEF'
  | 'SITUATION_REPORT'
  | 'EXECUTIVE_SUMMARY'
  | 'PUBLIC_ADVISORY';

export type AIProviderMode = 'MOCK' | 'OPENAI';

export interface ReportContext {
  disaster: {
    id: string;
    name: string;
    type: string;
    location: string;
    severity: string;
    radiusKm: number;
    declaredAt: string;
    coordinates?: { lat: number; lng: number };
  };
  threatLevel: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  threatScore: number;
  confidence: number;
  population: {
    totalAffected: number;
    highRiskDemographicCount: number;
    densityPerSqKm: number;
    evacuatedCount: number;
    strandedCount: number;
    evacuationComplianceRate: number;
  };
  weather: {
    rainfallMm: number;
    windSpeedKmph: number;
    temperatureCelsius: number;
    humidityPercent: number;
    barometricPressureHpa: number;
    stormSurgeMeters?: number;
    riverLevelMeters?: number;
    conditionDescription: string;
    forecastTrend: string;
  };
  infrastructure: {
    bridgesCollapsed: number;
    substationsDamaged: number;
    waterTreatmentPlantsCompromised: number;
    cellularTowersOffline: number;
    criticalEmbankmentsBreached: number;
    structuralDamagePercentage: number;
  };
  hospitals: {
    totalHospitals: number;
    operatingAtFullCapacity: number;
    icuBedsAvailable: number;
    traumaSurgeCapacityPercent: number;
    backupGeneratorsOperational: boolean;
    medicalOxygenSupplyHours: number;
  };
  roads: Array<{
    id: string;
    name: string;
    status: string;
    isPrimaryEvacuationCorridor: boolean;
    blockedReason?: string;
  }>;
  resources: {
    rescueBoats: { total: number; available: number };
    ambulances: { total: number; available: number };
    foodRationsKits: { available: number; required: number };
    potableWaterLiters: { available: number; required: number };
    emergencyMedicalKits: { available: number; required: number };
    personnelRescueTeams: { total: number; available: number };
  };
  traffic?: {
    overallCongestionLevel: string;
    chokepointsIdentified: string[];
  };
  triggeredRules: Array<any>;
  recommendations: Array<any>;
  priorityActions: string[];
  officerNotes?: string;
  generatedAt?: string;
}

export interface GeneratedReport {
  id: string;
  type: ReportType;
  title: string;
  content: string;
  summary: string;
  provider: AIProviderMode;
  providerName: string;
  mode: 'Local AI Mode' | 'OpenAI Mode';
  generatedAt: string;
  generationTimeMs: number;
  confidence: number;
  triggeredRulesCount: number;
  version: string;
  metadata?: Record<string, any>;
}

export interface AIProviderConfig {
  apiKey?: string;
  model?: string;
  temperature?: number;
  timeoutMs?: number;
}
