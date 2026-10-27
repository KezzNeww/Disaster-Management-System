import React, { createContext, useContext, useState, useCallback } from 'react';
import { AIPredictionProfile, DisasterItem } from '../types';
import { mockAIPredictions } from '../mock/mockPredictions';
import { calculateWeightedRisk, RiskFactors } from '../utils/algorithms/riskAssessment';

interface PredictionContextType {
  prediction: AIPredictionProfile;
  selectedDisasterId: string;
  setSelectedDisasterId: (id: string) => void;
  runPredictionForDisaster: (disaster: DisasterItem) => void;
  authorizeAction: (recommendationId: string) => void;
  authorizedRecommendations: Set<string>;
}

const PredictionContext = createContext<PredictionContextType | undefined>(undefined);

export function PredictionProvider({ children }: { children: React.ReactNode }) {
  const [prediction, setPrediction] = useState<AIPredictionProfile>(mockAIPredictions);
  const [selectedDisasterId, setSelectedDisasterId] = useState<string>(mockAIPredictions.disasterId);
  const [authorizedRecommendations, setAuthorizedRecommendations] = useState<Set<string>>(new Set());

  // Deterministically recalculate and re-evaluate AI predictions for a specific disaster
  const runPredictionForDisaster = useCallback((disaster: DisasterItem) => {
    setSelectedDisasterId(disaster.id);

    const factors: RiskFactors = {
      rainfallMmH: disaster.weather.precipitationMmH,
      windSpeedKmh: disaster.weather.windSpeedKmh,
      populationDensityPerSqKm: Math.round(disaster.affectedPopulation / (Math.PI * Math.pow(disaster.radiusKm, 2))),
      infrastructureDamagePercent: disaster.severity === 'CRITICAL' ? 84 : 45,
      historicalFrequencyScale: disaster.type === 'FLOOD' ? 9 : 7,
      hospitalAvailabilityPercent: 62,
      roadAccessibilityPercent: 60,
    };

    const riskOutput = calculateWeightedRisk(factors);

    setPrediction((prev) => ({
      ...prev,
      disasterId: disaster.id,
      disasterName: disaster.name,
      calculatedRiskScore: riskOutput.riskScore,
      confidenceScore: riskOutput.confidencePercent,
      reasoningSummary: `Deterministic multi-variable telemetry model confirms ${riskOutput.riskLevel} threat pattern for ${disaster.name}. Precipitation rate of ${disaster.weather.precipitationMmH} mm/h and sustained wind velocity of ${disaster.weather.windSpeedKmh} km/h are primary escalation drivers.`,
      timeline: [
        {
          timeOffset: '+2 Hours',
          projectedSeverity: riskOutput.riskScore > 80 ? 'CRITICAL' : 'HIGH',
          inundationAreaSqKm: Math.round(disaster.radiusKm * 18),
          evacuationUrgency: Math.min(100, Math.round(riskOutput.riskScore * 0.95)),
          casualtyRiskIndex: Math.round(riskOutput.riskScore * 0.75),
        },
        {
          timeOffset: '+4 Hours (Peak)',
          projectedSeverity: riskOutput.riskLevel,
          inundationAreaSqKm: Math.round(disaster.radiusKm * 32),
          evacuationUrgency: Math.min(100, Math.round(riskOutput.riskScore * 1.05)),
          casualtyRiskIndex: Math.round(riskOutput.riskScore * 0.9),
        },
        {
          timeOffset: '+8 Hours',
          projectedSeverity: riskOutput.riskLevel,
          inundationAreaSqKm: Math.round(disaster.radiusKm * 38),
          evacuationUrgency: Math.round(riskOutput.riskScore * 0.9),
          casualtyRiskIndex: Math.round(riskOutput.riskScore * 0.8),
        },
        {
          timeOffset: '+12 Hours',
          projectedSeverity: 'MODERATE',
          inundationAreaSqKm: Math.round(disaster.radiusKm * 41),
          evacuationUrgency: 60,
          casualtyRiskIndex: 45,
        },
        {
          timeOffset: '+24 Hours',
          projectedSeverity: 'LOW',
          inundationAreaSqKm: Math.round(disaster.radiusKm * 42),
          evacuationUrgency: 35,
          casualtyRiskIndex: 20,
        },
      ],
    }));
  }, []);

  const authorizeAction = useCallback((recId: string) => {
    setAuthorizedRecommendations((prev) => {
      const next = new Set(prev);
      next.add(recId);
      return next;
    });
  }, []);

  return (
    <PredictionContext.Provider
      value={{
        prediction,
        selectedDisasterId,
        setSelectedDisasterId,
        runPredictionForDisaster,
        authorizeAction,
        authorizedRecommendations,
      }}
    >
      {children}
    </PredictionContext.Provider>
  );
}

export function usePredictionContext() {
  const context = useContext(PredictionContext);
  if (!context) {
    throw new Error('usePredictionContext must be used within a PredictionProvider');
  }
  return context;
}
