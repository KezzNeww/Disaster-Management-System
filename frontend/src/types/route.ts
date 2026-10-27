export interface RouteCoordinate {
  lat: number;
  lng: number;
}

export interface RouteOption {
  id: string;
  name: string;
  type: 'safe' | 'shortest' | 'alternate';
  distanceKm: number;
  durationMinutes: number;
  hazardBufferKm: number;
  evacuationCapacityPerHour: number;
  riskScore: number; // 0 - 100
  waypoints: [number, number][];
  status: 'CLEAR' | 'HAZARD_PROXIMITY' | 'CONGESTED';
  advisory: string;
}

export interface BlockedRoadSegment {
  id: string;
  name: string;
  district: string;
  reason: 'SURGE_FLOODING' | 'STRUCTURAL_COLLAPSE' | 'DEBRIS_BLOCKAGE' | 'ACTIVE_FIRE_LINE';
  severity: 'CRITICAL' | 'HIGH';
  coordinates: [number, number][];
  reportedTime: string;
  clearanceEtaHours: number;
}
