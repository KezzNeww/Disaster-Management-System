export type ResourceCategory =
  | 'FOOD'
  | 'WATER'
  | 'MEDICAL_KITS'
  | 'AMBULANCES'
  | 'HELICOPTERS'
  | 'SHELTERS';

export interface InventoryCategoryCard {
  id: ResourceCategory;
  name: string;
  totalStock: number;
  usage: number;
  remaining: number;
  unit: string;
  status: 'OPTIMAL' | 'MODERATE' | 'LOW' | 'CRITICAL';
  trend: string;
  categoryIcon: string;
}

export interface ResourceAllocationItem {
  id: string;
  resourceName: string;
  category: ResourceCategory;
  quantityAllocated: number;
  unit: string;
  assignedIncident: string;
  district: string;
  coordinatorAgency: string;
  dispatchStatus: 'DISPATCHED' | 'EN_ROUTE' | 'ON_SITE' | 'STANDBY' | 'EXHAUSTED';
  etaMinutes: number;
  lastUpdated: string;
}

export type ResourceUnit = ResourceAllocationItem;
