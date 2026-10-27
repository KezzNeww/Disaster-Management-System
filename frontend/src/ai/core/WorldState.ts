import { AIRule, AIRecommendation, AIInsight, AIOfficerBrief, AIPredictionTimelineItem } from '../types';

export interface DisasterInfo {
  id: string;
  name: string;
  type: 'FLOOD' | 'CYCLONE' | 'WILDFIRE' | 'EARTHQUAKE' | 'URBAN_FIRE' | 'INDUSTRIAL_ACCIDENT';
  location: string;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  epicenterOrCentroid?: { lat: number; lng: number };
  declaredAt: string;
  radiusKm: number;
}

export interface WeatherInfo {
  rainfallMm: number;
  windSpeedKmph: number;
  temperatureCelsius: number;
  humidityPercent: number;
  barometricPressureHpa: number;
  stormSurgeMeters?: number;
  riverLevelMeters?: number;
  riverFloodStageMeters?: number;
  airQualityIndex?: number;
  conditionDescription: string;
  forecastTrend: 'DETERIORATING' | 'STABLE' | 'IMPROVING';
}

export interface PopulationInfo {
  totalAffected: number;
  highRiskDemographicCount: number; // elderly, infants, hospital dependent
  densityPerSqKm: number;
  evacuatedCount: number;
  strandedCount: number;
  evacuationComplianceRate: number; // 0.0 - 1.0
}

export interface InfrastructureDamage {
  bridgesCollapsed: number;
  substationsDamaged: number;
  waterTreatmentPlantsCompromised: number;
  cellularTowersOffline: number;
  criticalEmbankmentsBreached: number;
  structuralDamagePercentage: number;
}

export interface HospitalAvailability {
  totalHospitals: number;
  operatingAtFullCapacity: number;
  icuBedsAvailable: number;
  traumaSurgeCapacityPercent: number;
  backupGeneratorsOperational: boolean;
  medicalOxygenSupplyHours: number;
}

export interface RoadConditionItem {
  id: string;
  name: string;
  status: 'CLEAR' | 'CONGESTED' | 'FLOOD_WARNING' | 'IMPASSABLE';
  waterDepthMeters?: number;
  elevationMeters: number;
  isPrimaryEvacuationCorridor: boolean;
  blockedReason?: string;
  estimatedTravelTimeMinutes: number;
}

export interface ShelterAvailability {
  totalShelters: number;
  activeShelters: number;
  totalCapacity: number;
  currentOccupancy: number;
  criticalSuppliesExhausted: boolean;
}

export interface ResourceInventory {
  rescueBoats: { total: number; deployed: number; available: number };
  ambulances: { total: number; deployed: number; available: number };
  foodRationsKits: { available: number; required: number };
  potableWaterLiters: { available: number; required: number };
  emergencyMedicalKits: { available: number; required: number };
  heavyEquipmentExcavators: { total: number; available: number };
  personnelRescueTeams: { total: number; deployed: number; available: number };
}

export interface TrafficStatus {
  overallCongestionLevel: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  chokepointsIdentified: string[];
  gridlockOnEvacuationRoutes: boolean;
  averageSpeedKmph: number;
}

export interface EmergencyAlert {
  id: string;
  type: 'RED_ALERT' | 'AMBER_ALERT' | 'SHELTER_IN_PLACE' | 'ALL_CLEAR';
  title: string;
  message: string;
  dispatchedAt: string;
  targetZones: string[];
}

export interface AgentStatusItem {
  agentName: string;
  status: 'ONLINE' | 'PROCESSING' | 'IDLE' | 'ERROR';
  lastProcessedAt: string;
  contributionSummary: string;
}

export interface ReasoningTraceItem {
  step: number;
  timestamp: string;
  source: string;
  category: string;
  observation: string;
  inference: string;
  confidence: number;
}

export interface WorldState {
  // Scenario & Core Disaster
  currentDisaster: DisasterInfo;

  // Environmental & Physical Realities
  weather: WeatherInfo;
  population: PopulationInfo;
  infrastructure: InfrastructureDamage;
  hospitals: HospitalAvailability;
  roads: RoadConditionItem[];
  shelters: ShelterAvailability;
  resources: ResourceInventory;
  traffic: TrafficStatus;

  // Real-Time Alerts & Telemetry
  alerts: EmergencyAlert[];
  insights: AIInsight[];

  // Expert Assessment & Synthesis Outputs
  currentRiskLevel: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  currentPriorityLevel: 'IMMEDIATE' | 'HIGH_PRIORITY' | 'ADVISORY';
  threatScore: number; // 0 - 100
  systemConfidence: number; // 0.0 - 1.0

  // Decision Outputs & Explanations
  triggeredRules: AIRule[];
  generatedRecommendations: AIRecommendation[];
  priorityActions: string[];
  officerBrief: AIOfficerBrief;
  timeline: AIPredictionTimelineItem[];
  situationSummary: string;

  // XAI Audit Logs
  reasoningTrace: ReasoningTraceItem[];
  agentStatuses: Record<string, AgentStatusItem>;

  lastUpdated: string;
}
