export type DisasterSeverityLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface TelemetryPacket {
  sensorId: string;
  stationCoordinates: { latitude: number; longitude: number };
  recordedAt: Date;
  metricType: string;
  metricValue: number;
}
