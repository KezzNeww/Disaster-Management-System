import { RouteOption, BlockedRoadSegment } from '../types';

export interface RouteHubLocation {
  id: string;
  name: string;
  coordinates: [number, number];
  type: 'EVACUATION_CAMP' | 'HOSPITAL' | 'AIRBASE' | 'SUPPLY_DEPOT';
}

export const mockRouteLocations: RouteHubLocation[] = [
  {
    id: 'LOC-01',
    name: 'Puri Coastal Primary Evacuation Zone A',
    coordinates: [19.8135, 85.8312],
    type: 'EVACUATION_CAMP',
  },
  {
    id: 'LOC-02',
    name: 'Bhubaneswar State Command Emergency Hub',
    coordinates: [20.2961, 85.8245],
    type: 'SUPPLY_DEPOT',
  },
  {
    id: 'LOC-03',
    name: 'AIIMS Bhubaneswar Emergency Trauma Center',
    coordinates: [20.2315, 85.7766],
    type: 'HOSPITAL',
  },
  {
    id: 'LOC-04',
    name: 'Cuttack High-Ground Military Airfield',
    coordinates: [20.4625, 85.883],
    type: 'AIRBASE',
  },
];

export const mockRouteOptions: RouteOption[] = [
  {
    id: 'ROUTE-SAFE',
    name: 'Route Alpha: Western Ridge Corridor (Recommended Safe Route)',
    type: 'safe',
    distanceKm: 76.4,
    durationMinutes: 62,
    hazardBufferKm: 14.8,
    evacuationCapacityPerHour: 4800,
    riskScore: 12,
    status: 'CLEAR',
    advisory: 'Engineered high-elevation corridor. Armed escort and tow trucks stationed every 10km.',
    waypoints: [
      [19.8135, 85.8312], // Puri Start
      [19.872, 85.811],
      [19.954, 85.762],
      [20.082, 85.741],
      [20.198, 85.782],
      [20.2961, 85.8245], // Bhubaneswar Dest
    ],
  },
  {
    id: 'ROUTE-SHORTEST',
    name: 'Route Beta: National Highway 316 (Direct Shortest Route)',
    type: 'shortest',
    distanceKm: 58.2,
    durationMinutes: 98,
    hazardBufferKm: 1.2,
    evacuationCapacityPerHour: 1200,
    riskScore: 84,
    status: 'HAZARD_PROXIMITY',
    advisory: 'CRITICAL WARNING: Water encroachment at Km 24. Heavy congestion and risk of flash submergence.',
    waypoints: [
      [19.8135, 85.8312], // Puri Start
      [19.892, 85.825],
      [19.981, 85.835], // Near flash surge zone
      [20.095, 85.845],
      [20.192, 85.838],
      [20.2961, 85.8245], // Bhubaneswar Dest
    ],
  },
  {
    id: 'ROUTE-ALT',
    name: 'Route Gamma: Northern Railway Support Bypass',
    type: 'alternate',
    distanceKm: 89.6,
    durationMinutes: 84,
    hazardBufferKm: 22.0,
    evacuationCapacityPerHour: 3200,
    riskScore: 24,
    status: 'CLEAR',
    advisory: 'Secondary detour via Delang. Slightly longer distance with zero flood intersection.',
    waypoints: [
      [19.8135, 85.8312],
      [19.86, 85.74],
      [19.98, 85.69],
      [20.12, 85.71],
      [20.22, 85.76],
      [20.2961, 85.8245],
    ],
  },
];

export const mockBlockedRoads: BlockedRoadSegment[] = [
  {
    id: 'BLK-01',
    name: 'NH-316 Bhargavi River Overpass',
    district: 'Puri District',
    reason: 'SURGE_FLOODING',
    severity: 'CRITICAL',
    reportedTime: '45 mins ago',
    clearanceEtaHours: 8,
    coordinates: [
      [19.972, 85.828],
      [19.986, 85.837],
    ],
  },
  {
    id: 'BLK-02',
    name: 'Konark Marine Drive Coastal Strip',
    district: 'Puri-Konark Sector',
    reason: 'ACTIVE_FIRE_LINE',
    severity: 'CRITICAL',
    reportedTime: '2 hours ago',
    clearanceEtaHours: 14,
    coordinates: [
      [19.885, 85.952],
      [19.898, 86.012],
    ],
  },
  {
    id: 'BLK-03',
    name: 'Pipili Flyover Debris Jam',
    district: 'Puri Rural',
    reason: 'STRUCTURAL_COLLAPSE',
    severity: 'HIGH',
    reportedTime: '1 hour ago',
    clearanceEtaHours: 5,
    coordinates: [
      [20.114, 85.832],
      [20.126, 85.835],
    ],
  },
];
