export type UserRole =
  | 'CHIEF_INCIDENT_COMMANDER'
  | 'FIELD_OPERATIONS_OFFICER'
  | 'GEOSPATIAL_ANALYST'
  | 'LOGISTICS_COORDINATOR'
  | 'SYSTEM_ADMIN';

export interface UserProfile {
  id: string;
  name: string;
  callsign: string;
  role: UserRole;
  clearanceLevel: 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3' | 'MAX_AUTHORITY';
  avatarUrl?: string;
  organization: string;
}
