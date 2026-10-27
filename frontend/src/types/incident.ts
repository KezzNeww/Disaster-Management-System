import { DisasterSeverity } from './disaster';

export type IncidentPriority = 'P1_CRITICAL' | 'P2_HIGH' | 'P3_ELEVATED' | 'P4_ROUTINE';

export interface IncidentLog {
  id: string;
  disasterId: string;
  headline: string;
  priority: IncidentPriority;
  severity: DisasterSeverity;
  reportingAgency: string;
  timestamp: string;
  actionTaken?: string;
  verified: boolean;
}
