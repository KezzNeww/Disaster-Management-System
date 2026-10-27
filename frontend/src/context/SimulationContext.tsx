import React, { createContext, useContext, useState, useEffect } from 'react';
import { useDisasterContext } from './DisasterContext';
import { useResourceContext } from './ResourceContext';
import { useAlertContext } from './AlertContext';
import { useRouteContext } from './RouteContext';

interface SimulationContextType {
  isSimulationActive: boolean;
  toggleSimulation: () => void;
  tickCount: number;
  lastTickTime: string;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export function SimulationProvider({ children }: { children: React.ReactNode }) {
  const [isSimulationActive, setIsSimulationActive] = useState<boolean>(true);
  const [tickCount, setTickCount] = useState<number>(0);
  const [lastTickTime, setLastTickTime] = useState<string>('Initializing');

  const { disasters, simulateRainfallIncrease, simulatePopulationIncrease } = useDisasterContext();
  const { consumeInventoryRandomly } = useResourceContext();
  const { triggerNewSimulationAlert } = useAlertContext();
  const { simulateRoadBlockade } = useRouteContext();

  useEffect(() => {
    if (!isSimulationActive) return;

    const interval = setInterval(() => {
      setTickCount((prev) => prev + 1);
      setLastTickTime(new Date().toISOString().substring(11, 19) + ' UTC');

      // 1. Simulate rainfall / weather volatility on the primary active hazard
      if (disasters.length > 0) {
        const deltaRain = Math.random() > 0.4 ? Math.floor(3 + Math.random() * 7) : -2;
        simulateRainfallIncrease(disasters[0].id, deltaRain);

        // 2. Increment affected population estimate
        const deltaPop = Math.floor(250 + Math.random() * 650);
        simulatePopulationIncrease(disasters[0].id, deltaPop);
      }

      // 3. Randomly consume inventory stocks (relief consumption)
      consumeInventoryRandomly();

      // 4. Randomly trigger a new live telemetry alert (every ~10-15s)
      if (Math.random() > 0.45) {
        triggerNewSimulationAlert();
      }

      // 5. Occasionally fluctuate road blockage conditions
      if (Math.random() > 0.7) {
        simulateRoadBlockade();
      }
    }, 5000); // Strict 5-second interval per specification

    return () => clearInterval(interval);
  }, [
    isSimulationActive,
    disasters,
    simulateRainfallIncrease,
    simulatePopulationIncrease,
    consumeInventoryRandomly,
    triggerNewSimulationAlert,
    simulateRoadBlockade,
  ]);

  return (
    <SimulationContext.Provider
      value={{
        isSimulationActive,
        toggleSimulation: () => setIsSimulationActive((prev) => !prev),
        tickCount,
        lastTickTime,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulationContext() {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulationContext must be used within a SimulationProvider');
  }
  return context;
}
