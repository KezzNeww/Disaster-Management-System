import { useEffect, useState } from 'react';

export interface SocketConnectionState {
  isConnected: boolean;
  latencyMs: number;
  lastPingTimestamp: string | null;
}

export function useSocket() {
  const [connectionState] = useState<SocketConnectionState>({
    isConnected: true,
    latencyMs: 18,
    lastPingTimestamp: new Date().toISOString(),
  });

  useEffect(() => {
    // Realtime telemetry web socket connection stub
  }, []);

  return connectionState;
}
