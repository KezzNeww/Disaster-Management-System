import { useState } from 'react';
import { IncidentLog } from '../types';

export function useAlerts() {
  const [alerts, setAlerts] = useState<IncidentLog[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const markAllAsRead = () => {
    setUnreadCount(0);
  };

  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((item) => item.id !== id));
  };

  return {
    alerts,
    unreadCount,
    markAllAsRead,
    dismissAlert,
  };
}
