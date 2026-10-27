import { AIPredictionProfile } from '../types';

export const mockAIPredictions: AIPredictionProfile = {
  disasterId: 'DIS-2026-001',
  disasterName: 'Super Cyclone Vardhan (Cat 4)',
  modelVersion: 'AegisNeural-GeoEnsemble-v4.8',
  calculatedRiskScore: 94.2,
  confidenceScore: 96.8,
  primaryHazardDrivers: [
    'Barometric core pressure drop (932 hPa)',
    'Storm surge astronomical high tide coincidence (+4.2m)',
    'Coastal soil saturation index at 98.4%',
    'Population vulnerability density in low-elevation delta',
  ],
  reasoningSummary:
    'Deep learning atmospheric model predicts eye landfall within 3.5 hours at Puri coast. Coincident astronomical spring tide exacerbates inundation risk by 38% compared to standard hurricane surge models.',
  deepNeuralAnalysis:
    'Ensemble analysis computed across 10,000 Monte Carlo simulations indicates severe structural devastation probability for kutcha dwellings (>95%) and extensive flooding across 4,200 sq. km. Critical infrastructure failure risk for power grid is 91% if wind gusts surpass 170 km/h.',
  features: [
    {
      featureName: 'Storm Surge Inundation Depth',
      weight: 0.34,
      impactType: 'INCREASING_RISK',
      description: 'Projected 4.2m storm wave run-up exceeding coastal dykes.',
    },
    {
      featureName: 'Sustained Core Wind Velocity',
      weight: 0.28,
      impactType: 'INCREASING_RISK',
      description: '165 km/h sustained gusts inducing severe structural shear.',
    },
    {
      featureName: 'Precipitation Volume (6h Accumulation)',
      weight: 0.18,
      impactType: 'INCREASING_RISK',
      description: 'Over 280mm downpour preventing stormwater gravity drainage.',
    },
    {
      featureName: 'Completed Evacuation Density (Mitigating)',
      weight: 0.12,
      impactType: 'MITIGATING',
      description: '340,000 citizens relocated to elevated cyclone shelters.',
    },
    {
      featureName: 'Mangrove Bioshield Attenuation (Mitigating)',
      weight: 0.08,
      impactType: 'MITIGATING',
      description: 'Bhitarkanika mangrove forest dampening wave energy by 22%.',
    },
  ],
  timeline: [
    {
      timeOffset: '+2 Hours',
      projectedSeverity: 'HIGH',
      inundationAreaSqKm: 850,
      evacuationUrgency: 88,
      casualtyRiskIndex: 45,
    },
    {
      timeOffset: '+4 Hours (Landfall)',
      projectedSeverity: 'CRITICAL',
      inundationAreaSqKm: 2150,
      evacuationUrgency: 98,
      casualtyRiskIndex: 82,
    },
    {
      timeOffset: '+8 Hours',
      projectedSeverity: 'CRITICAL',
      inundationAreaSqKm: 3400,
      evacuationUrgency: 92,
      casualtyRiskIndex: 74,
    },
    {
      timeOffset: '+12 Hours',
      projectedSeverity: 'HIGH',
      inundationAreaSqKm: 4100,
      evacuationUrgency: 76,
      casualtyRiskIndex: 52,
    },
    {
      timeOffset: '+24 Hours',
      projectedSeverity: 'MODERATE',
      inundationAreaSqKm: 4250,
      evacuationUrgency: 45,
      casualtyRiskIndex: 28,
    },
  ],
  recommendations: [
    {
      id: 'REC-01',
      priority: 'IMMEDIATE',
      category: 'EVACUATION',
      title: 'Enforce Mandatory Zero-Casualty Evacuation in Sector 3 & 4',
      action: 'Mobilize 14 additional NDRF inflatable rescue boats to low-lying villages behind the sea dyke before 15:00 UTC.',
      impactScoreReduction: 18.5,
    },
    {
      id: 'REC-02',
      priority: 'IMMEDIATE',
      category: 'INFRASTRUCTURE',
      title: 'Proactive Power Grid Isolation & Backup Generator Lock',
      action: 'De-energize 132kV overhead transmission line across Puri-Bhubaneswar highway to avoid live wire hazards in floodwaters.',
      impactScoreReduction: 12.0,
    },
    {
      id: 'REC-03',
      priority: 'HIGH_PRIORITY',
      category: 'SUPPLY_CHAIN',
      title: 'Pre-Stage Clean Water Tankers at Kendrapara Safe Hub',
      action: 'Stage 30,000L potable water tanks and water purification tablets at higher elevation district ground.',
      impactScoreReduction: 9.4,
    },
    {
      id: 'REC-04',
      priority: 'ADVISORY',
      category: 'COMMUNICATION',
      title: 'Trigger CAP Multilingual SMS Warning Broadcast #4',
      action: 'Send urgent Odia and English cell broadcast warnings advising residents to remain inside reinforced shelters.',
      impactScoreReduction: 6.2,
    },
  ],
};
