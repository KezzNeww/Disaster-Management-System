export const ENTERPRISE_PALETTE = {
  backgroundDark: '#0F172A',
  surfacePanel: '#111827',
  telemetryBlue: '#2563EB',
  sensorCyan: '#38BDF8',
  statusOperational: '#22C55E',
  hazardCritical: '#EF4444',
  canvasDeep: '#0B0F17',
} as const;

export const INCIDENT_SEVERITY_LEVELS = {
  LOW: 'LOW',
  MODERATE: 'MODERATE',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
} as const;

export const DISASTER_TYPES = {
  EARTHQUAKE: 'EARTHQUAKE',
  FLOOD: 'FLOOD',
  WILDFIRE: 'WILDFIRE',
  CYCLONE: 'CYCLONE',
  TSUNAMI: 'TSUNAMI',
  LANDSLIDE: 'LANDSLIDE',
} as const;

export const DEFAULT_MAP_CENTER = {
  lat: 20.5937,
  lng: 78.9629,
  zoom: 5,
};
