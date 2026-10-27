import React, { createContext, useContext, useState, useCallback } from 'react';
import { DisasterItem } from '../types';
import { mockDisasters, mockKPIOverview } from '../mock/mockDisasters';
import { mockDashboardCharts } from '../mock/mockAnalytics';
import { calculateWeightedRisk, RiskFactors } from '../utils/algorithms/riskAssessment';

interface DisasterContextType {
  disasters: DisasterItem[];
  selectedDisaster: DisasterItem | null;
  currentDisaster: DisasterItem;
  kpiOverview: typeof mockKPIOverview;
  dashboardCharts: typeof mockDashboardCharts;
  selectDisaster: (disaster: DisasterItem | null) => void;
  recalculateDisasterRisk: (disasterId: string, customFactors?: Partial<RiskFactors>) => void;
  updateDisaster: (id: string, updates: Partial<DisasterItem>) => void;
  simulateRainfallIncrease: (disasterId: string, deltaMm: number) => void;
  simulatePopulationIncrease: (disasterId: string, deltaPop: number) => void;
}

const DisasterContext = createContext<DisasterContextType | undefined>(undefined);

export function DisasterProvider({ children }: { children: React.ReactNode }) {
  const [disasters, setDisasters] = useState<DisasterItem[]>(mockDisasters);
  const [selectedDisaster, setSelectedDisaster] = useState<DisasterItem | null>(null);
  const [dashboardCharts] = useState(mockDashboardCharts);

  const currentDisaster = disasters[0]; // Primary active disaster threat (Cyclone Vardhan)

  // Compute live KPIs
  const highRiskAreasCount = disasters.filter((d) => d.riskScore >= 65).length;
  const emergencyTeamsCount = disasters.reduce((sum, d) => sum + d.emergencyTeamsDeployed, 0);

  const kpiOverview = {
    ...mockKPIOverview,
    currentDisaster,
    highRiskAreasCount,
    emergencyTeamsCount,
  };

  const selectDisaster = useCallback((d: DisasterItem | null) => {
    setSelectedDisaster(d);
  }, []);

  const updateDisaster = useCallback((id: string, updates: Partial<DisasterItem>) => {
    setDisasters((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates, lastUpdated: 'Just now' } : item))
    );
  }, []);

  // Recalculates risk deterministically using Weighted Scoring
  const recalculateDisasterRisk = useCallback(
    (disasterId: string, customFactors?: Partial<RiskFactors>) => {
      setDisasters((prev) =>
        prev.map((item) => {
          if (item.id !== disasterId) return item;

          const factors: RiskFactors = {
            rainfallMmH: item.weather.precipitationMmH,
            windSpeedKmh: item.weather.windSpeedKmh,
            populationDensityPerSqKm: Math.round(item.affectedPopulation / (Math.PI * Math.pow(item.radiusKm, 2))),
            infrastructureDamagePercent: item.severity === 'CRITICAL' ? 78 : item.severity === 'HIGH' ? 52 : 30,
            historicalFrequencyScale: item.type === 'FLOOD' ? 9 : item.type === 'CYCLONE' ? 8 : 6,
            hospitalAvailabilityPercent: 65,
            roadAccessibilityPercent: 70,
            ...customFactors,
          };

          const result = calculateWeightedRisk(factors);

          return {
            ...item,
            riskScore: Math.round(result.riskScore),
            severity: result.riskLevel,
            lastUpdated: 'Just now',
          };
        })
      );
    },
    []
  );

  const simulateRainfallIncrease = useCallback(
    (disasterId: string, deltaMm: number) => {
      setDisasters((prev) =>
        prev.map((item) => {
          if (item.id !== disasterId) return item;
          const newPrecip = Math.max(0, item.weather.precipitationMmH + deltaMm);
          const newWind = Math.min(220, item.weather.windSpeedKmh + Math.round(deltaMm * 0.4));

          // Run weighted risk assessment immediately
          const factors: RiskFactors = {
            rainfallMmH: newPrecip,
            windSpeedKmh: newWind,
            populationDensityPerSqKm: 2800,
            infrastructureDamagePercent: 82,
            historicalFrequencyScale: 9,
            hospitalAvailabilityPercent: 60,
            roadAccessibilityPercent: 55,
          };
          const assessment = calculateWeightedRisk(factors);

          return {
            ...item,
            riskScore: Math.round(assessment.riskScore),
            severity: assessment.riskLevel,
            weather: {
              ...item.weather,
              precipitationMmH: newPrecip,
              windSpeedKmh: newWind,
            },
            lastUpdated: 'Just now',
          };
        })
      );
    },
    []
  );

  const simulatePopulationIncrease = useCallback((disasterId: string, deltaPop: number) => {
    setDisasters((prev) =>
      prev.map((item) =>
        item.id === disasterId
          ? { ...item, affectedPopulation: item.affectedPopulation + deltaPop, lastUpdated: 'Just now' }
          : item
      )
    );
  }, []);

  return (
    <DisasterContext.Provider
      value={{
        disasters,
        selectedDisaster,
        currentDisaster,
        kpiOverview,
        dashboardCharts,
        selectDisaster,
        recalculateDisasterRisk,
        updateDisaster,
        simulateRainfallIncrease,
        simulatePopulationIncrease,
      }}
    >
      {children}
    </DisasterContext.Provider>
  );
}

export function useDisasterContext() {
  const context = useContext(DisasterContext);
  if (!context) {
    throw new Error('useDisasterContext must be used within a DisasterProvider');
  }
  return context;
}
