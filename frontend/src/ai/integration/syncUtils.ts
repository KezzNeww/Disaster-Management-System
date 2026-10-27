import { WorldState, RoadConditionItem, EmergencyAlert } from '../core/WorldState';
import { DisasterItem, InventoryCategoryCard, BlockedRoadSegment } from '../../types';
import { LiveAlertItem } from '../../mock/mockAlerts';
import { DijkstraPathResult } from '../../utils/algorithms/dijkstraRouter';

export interface AppSyncData {
  currentDisaster?: DisasterItem;
  selectedDisaster?: DisasterItem | null;
  disasters?: DisasterItem[];
  inventory?: InventoryCategoryCard[];
  blockedRoads?: BlockedRoadSegment[];
  alerts?: LiveAlertItem[];
  safeRoute?: DijkstraPathResult | null;
  shortestRoute?: DijkstraPathResult | null;
  activeRouteType?: 'safe' | 'shortest';
}

/**
 * Maps live Disaster Management application state into the Blackboard WorldState format.
 */
export function mapAppContextToWorldState(data: AppSyncData, _prevState: WorldState): Partial<WorldState> {
  const disaster = (data.selectedDisaster || data.currentDisaster || data.disasters?.[0]) as DisasterItem | undefined;
  if (!disaster) {
    return {};
  }
  const isFlood = disaster.type === 'FLOOD';
  const isCyclone = disaster.type === 'CYCLONE';
  const isEarthquake = disaster.type === 'EARTHQUAKE';
  const isFire = disaster.type === 'FIRE';

  // 1. Current Disaster Mapping
  const currentDisaster = {
    id: disaster.id,
    name: disaster.name,
    type: (isFire ? 'WILDFIRE' : disaster.type) as WorldState['currentDisaster']['type'],
    location: `${disaster.district}, ${disaster.state}`,
    severity: disaster.severity,
    radiusKm: disaster.radiusKm || 45,
    declaredAt: disaster.detectedAt || new Date().toISOString(),
    epicenterOrCentroid: disaster.coordinates,
  };

  // 2. Weather Information Mapping
  const weather = {
    rainfallMm: disaster.weather?.precipitationMmH ? Math.round(disaster.weather.precipitationMmH * 6) : isFlood ? 210 : 25,
    windSpeedKmph: disaster.weather?.windSpeedKmh || (isCyclone ? 155 : 35),
    temperatureCelsius: disaster.weather?.temperatureC || 28,
    humidityPercent: disaster.weather?.humidityPercent || 80,
    barometricPressureHpa: disaster.weather?.windSpeedKmh && disaster.weather.windSpeedKmh > 100
      ? Math.max(935, 1013 - Math.round(disaster.weather.windSpeedKmh * 0.45))
      : 1008,
    stormSurgeMeters: isCyclone ? Math.max(2.4, Math.round(((disaster.weather?.windSpeedKmh || 120) / 45) * 10) / 10) : 0,
    riverLevelMeters: isFlood ? 6.2 : 2.2,
    riverFloodStageMeters: 5.0,
    airQualityIndex: isFire ? 360 : 75,
    conditionDescription: disaster.weather?.condition || 'Monitored Weather Envelope',
    forecastTrend: (disaster.severity === 'CRITICAL' || disaster.severity === 'HIGH' ? 'DETERIORATING' : 'STABLE') as 'DETERIORATING' | 'STABLE' | 'IMPROVING',
  };

  // 3. Human Exposure & Population Mapping
  const affectedPop = disaster.affectedPopulation || 45000;
  const radiusKm = Math.max(1, disaster.radiusKm || 30);
  const density = Math.round(affectedPop / (Math.PI * Math.pow(radiusKm, 2)));

  const population = {
    totalAffected: affectedPop,
    highRiskDemographicCount: Math.round(affectedPop * 0.085),
    densityPerSqKm: Math.max(800, density),
    evacuatedCount: Math.round(affectedPop * (disaster.severity === 'CRITICAL' ? 0.38 : 0.65)),
    strandedCount: Math.round(affectedPop * (disaster.severity === 'CRITICAL' ? 0.035 : 0.01)),
    evacuationComplianceRate: disaster.severity === 'CRITICAL' ? 0.52 : 0.78,
  };

  // 4. Infrastructure Fragility Mapping
  const blockedRoads = data.blockedRoads || [];
  const collapsedBridges = blockedRoads.filter(
    (b) => b.reason === 'STRUCTURAL_COLLAPSE' || b.name.toLowerCase().includes('bridge')
  ).length;

  const infrastructure = {
    bridgesCollapsed: collapsedBridges,
    substationsDamaged: disaster.severity === 'CRITICAL' ? 3 : disaster.severity === 'HIGH' ? 2 : 1,
    waterTreatmentPlantsCompromised: isFlood ? 1 : 0,
    cellularTowersOffline: disaster.severity === 'CRITICAL' ? 4 : 1,
    criticalEmbankmentsBreached: isFlood && disaster.severity === 'CRITICAL' ? 1 : 0,
    structuralDamagePercentage: isEarthquake ? 35 : disaster.riskScore > 75 ? 24 : 12,
  };

  // 5. Hospital & Medical Capacity Mapping
  const hospitals = {
    totalHospitals: 6,
    operatingAtFullCapacity: disaster.riskScore > 80 ? 5 : 3,
    icuBedsAvailable: Math.max(3, 22 - Math.round(disaster.riskScore * 0.2)),
    traumaSurgeCapacityPercent: Math.min(98, Math.round(disaster.riskScore * 1.15)),
    backupGeneratorsOperational: !isEarthquake,
    medicalOxygenSupplyHours: disaster.severity === 'CRITICAL' ? 20 : 36,
  };

  // 6. Roads Mapping
  const roads: RoadConditionItem[] = [
    {
      id: 'corridor-dijkstra-safe',
      name: data.safeRoute?.name || 'High-Elevation Inland Bypass (Route Alpha)',
      status: 'CLEAR',
      elevationMeters: 18.5,
      isPrimaryEvacuationCorridor: data.activeRouteType === 'safe',
      estimatedTravelTimeMinutes: data.safeRoute?.durationMinutes || 48,
    },
    {
      id: 'corridor-dijkstra-shortest',
      name: data.shortestRoute?.name || 'Direct Coastal Highway NH-316 (Route Beta)',
      status: blockedRoads.length > 0 ? 'IMPASSABLE' : 'CONGESTED',
      elevationMeters: 2.2,
      isPrimaryEvacuationCorridor: data.activeRouteType === 'shortest',
      waterDepthMeters: isFlood ? 0.75 : 0.1,
      blockedReason: blockedRoads[0]?.reason || 'High storm surge flooding and debris',
      estimatedTravelTimeMinutes: data.shortestRoute?.durationMinutes || 72,
    },
    ...blockedRoads.map((b, idx) => ({
      id: `road-blocked-${b.id || idx}`,
      name: b.name,
      status: 'IMPASSABLE' as const,
      elevationMeters: 3.0,
      isPrimaryEvacuationCorridor: false,
      blockedReason: b.reason,
      estimatedTravelTimeMinutes: 120,
    })),
  ];

  // 7. Resource Stockpile & Logistics Mapping
  const inv = data.inventory || [];
  const getInvCount = (id: string, fallbackTotal: number, fallbackUsage: number) => {
    const card = inv.find((c) => c.id === id);
    if (!card) return { available: fallbackTotal - fallbackUsage, total: fallbackTotal, usage: fallbackUsage };
    return { available: card.remaining, total: card.totalStock, usage: card.usage };
  };

  const foodData = getInvCount('FOOD', 50000, 32000);
  const waterData = getInvCount('WATER', 100000, 68000);
  const medData = getInvCount('MEDICAL_KITS', 2500, 1850);
  const ambData = getInvCount('AMBULANCES', 50, 42);

  const resources = {
    rescueBoats: { total: 24, deployed: 20, available: 4 },
    ambulances: { total: ambData.total, deployed: ambData.usage, available: ambData.available },
    foodRationsKits: { available: foodData.available, required: Math.round(affectedPop * 0.75) },
    potableWaterLiters: { available: waterData.available, required: Math.round(affectedPop * 2.5) },
    emergencyMedicalKits: { available: medData.available, required: Math.round(affectedPop * 0.02) },
    heavyEquipmentExcavators: { total: 16, available: 6 },
    personnelRescueTeams: { total: 35, deployed: 30, available: 5 },
  };

  // 8. Alerts Mapping
  const rawAlerts = data.alerts || [];
  const alerts: EmergencyAlert[] = rawAlerts.slice(0, 8).map((a) => ({
    id: a.id,
    type: a.priority === 'CRITICAL' ? 'RED_ALERT' : 'AMBER_ALERT',
    title: `${a.type} DIRECTIVE: ${a.location}`,
    message: a.description,
    dispatchedAt: a.timestamp,
    targetZones: [a.location],
  }));

  // 9. Traffic Status Mapping
  const traffic = {
    overallCongestionLevel: (disaster.severity === 'CRITICAL' ? 'CRITICAL' : 'HIGH') as 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW',
    chokepointsIdentified: ['NH-316 Coastal Junction', 'Inland Ridge Tollway'],
    gridlockOnEvacuationRoutes: disaster.riskScore > 75,
    averageSpeedKmph: disaster.riskScore > 75 ? 14 : 32,
  };

  return {
    currentDisaster,
    weather,
    population,
    infrastructure,
    hospitals,
    roads,
    resources,
    alerts,
    traffic,
  };
}
