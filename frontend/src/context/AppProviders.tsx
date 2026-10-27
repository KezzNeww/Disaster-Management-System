import React from 'react';
import { ThemeProvider } from './ThemeProvider';
import { DisasterProvider } from './DisasterContext';
import { ResourceProvider } from './ResourceContext';
import { AlertProvider } from './AlertContext';
import { RouteProvider } from './RouteContext';
import { PredictionProvider } from './PredictionContext';
import { SimulationProvider } from './SimulationContext';
import { BlackboardSyncBridge } from '../ai/integration/BlackboardSyncBridge';

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="aegis-disaster-theme">
      <DisasterProvider>
        <ResourceProvider>
          <AlertProvider>
            <RouteProvider>
              <PredictionProvider>
                <SimulationProvider>
                  <BlackboardSyncBridge>{children}</BlackboardSyncBridge>
                </SimulationProvider>
              </PredictionProvider>
            </RouteProvider>
          </AlertProvider>
        </ResourceProvider>
      </DisasterProvider>
    </ThemeProvider>
  );
}
