export type DisasterType = 'FLOOD' | 'EARTHQUAKE' | 'CYCLONE' | 'FIRE';

export type DisasterSeverity = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';

export type DisasterStatus = 'ACTIVE' | 'CONTAINED' | 'MONITORING' | 'RESOLVED';

export interface WeatherCondition {
  temperatureC: number;
  windSpeedKmh: number;
  humidityPercent: number;
  precipitationMmH: number;
  condition: string;
}

export interface DisasterItem {
  id: string;
  name: string;
  type: DisasterType;
  severity: DisasterSeverity;
  status: DisasterStatus;
  riskScore: number; // 0 - 100
  affectedPopulation: number;
  district: string;
  state: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  radiusKm: number;
  emergencyTeamsDeployed: number;
  sheltersOpen: number;
  casualtiesEstimate: number;
  weather: WeatherCondition;
  detectedAt: string;
  lastUpdated: string;
  summary: string;
}

export type Disaster = DisasterItem;

export interface KPIOverview {
  currentDisaster: DisasterItem;
  highRiskAreasCount: number;
  emergencyTeamsCount: number;
  availableResourcesCount: number;
  activeAlertsCount: number;
  deltaTrends: {
    highRisk: string;
    teams: string;
    resources: string;
    alerts: string;
  };
}
