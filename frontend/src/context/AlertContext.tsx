import React, { createContext, useContext, useState, useCallback } from 'react';
import { mockAlerts, LiveAlertItem } from '../mock/mockAlerts';

interface AlertContextType {
  alerts: LiveAlertItem[];
  unreadCount: number;
  activeCriticalCount: number;
  resolveAlert: (id: string) => void;
  updateAlertStatus: (id: string, newStatus: LiveAlertItem['status']) => void;
  triggerNewSimulationAlert: () => void;
  clearAllAlerts: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [alerts, setAlerts] = useState<LiveAlertItem[]>(mockAlerts);
  const [unreadCount, setUnreadCount] = useState<number>(3);

  const activeCriticalCount = alerts.filter(
    (a) => a.priority === 'CRITICAL' && a.status !== 'RESOLVED'
  ).length;

  const resolveAlert = useCallback((id: string) => {
    setAlerts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'RESOLVED', timestamp: 'Resolved just now' } : item
      )
    );
  }, []);

  const updateAlertStatus = useCallback((id: string, newStatus: LiveAlertItem['status']) => {
    setAlerts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  }, []);

  // Generates realistic new live alerts during continuous simulation
  const triggerNewSimulationAlert = useCallback(() => {
    const alertTypes: LiveAlertItem['type'][] = ['FLOOD', 'CYCLONE', 'EARTHQUAKE', 'FIRE', 'INFRASTRUCTURE'];
    const randomType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    const randomNum = Math.floor(1000 + Math.random() * 9000);

    const newAlert: LiveAlertItem = {
      id: `ALT-${randomNum}`,
      priority: Math.random() > 0.4 ? 'CRITICAL' : 'HIGH',
      type: randomType,
      location: `Sector ${String.fromCharCode(65 + Math.floor(Math.random() * 6))}-0${Math.floor(1 + Math.random() * 9)} Radar Zone`,
      timestamp: 'Just now',
      status: 'DISPATCHING',
      description: `Automated telemetry breach detected: ${randomType} sensor values surpassed advisory thresholds.`,
      sourceAgency: 'Sentinel UAV Satellite Feed',
    };

    setAlerts((prev) => [newAlert, ...prev.slice(0, 24)]);
    setUnreadCount((prev) => prev + 1);
  }, []);

  const clearAllAlerts = useCallback(() => {
    setUnreadCount(0);
  }, []);

  return (
    <AlertContext.Provider
      value={{
        alerts,
        unreadCount,
        activeCriticalCount,
        resolveAlert,
        updateAlertStatus,
        triggerNewSimulationAlert,
        clearAllAlerts,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
}

export function useAlertContext() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlertContext must be used within an AlertProvider');
  }
  return context;
}
