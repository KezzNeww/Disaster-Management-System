import {
  InventoryCategoryCard,
  ResourceAllocationItem,
  ResourceCategory,
  DisasterItem,
} from '../../types';

export interface ResourceDemand {
  category: ResourceCategory;
  requestedQuantity: number;
  unit: string;
}

export interface RegionAllocationDemand {
  disasterId: string;
  disasterName: string;
  district: string;
  riskScore: number;
  severity: string;
  affectedPopulation: number;
  demands: Record<ResourceCategory, number>;
}

export interface GreedyAllocationResult {
  updatedInventory: InventoryCategoryCard[];
  allocationRecords: ResourceAllocationItem[];
  shortages: Record<ResourceCategory, number>;
  totalAllocatedCount: number;
}

/**
 * Greedy Resource Allocation Algorithm
 * 1. Sorts all disaster zones descending by computed Risk Score.
 * 2. Calculates proportional resource demands based on affected population and severity.
 * 3. Greedily allocates available stockpile to the highest-priority regions first.
 * 4. Records remaining stock, shortages, and allocation dispatch logs.
 */
export function executeGreedyResourceAllocation(
  disasters: DisasterItem[],
  currentInventory: InventoryCategoryCard[]
): GreedyAllocationResult {
  // Deep clone inventory to prevent unintended state mutation
  const inventoryCopy: Record<ResourceCategory, { total: number; remaining: number; allocated: number; unit: string }> = {
    FOOD: { total: 0, remaining: 0, allocated: 0, unit: 'Packets' },
    WATER: { total: 0, remaining: 0, allocated: 0, unit: 'Liters' },
    MEDICAL_KITS: { total: 0, remaining: 0, allocated: 0, unit: 'Units' },
    AMBULANCES: { total: 0, remaining: 0, allocated: 0, unit: 'Vehicles' },
    HELICOPTERS: { total: 0, remaining: 0, allocated: 0, unit: 'Aircraft' },
    SHELTERS: { total: 0, remaining: 0, allocated: 0, unit: 'Hubs' },
  };

  currentInventory.forEach((card) => {
    inventoryCopy[card.id] = {
      total: card.totalStock,
      remaining: card.totalStock, // Reset to re-allocate greedily from total stock or current remaining
      allocated: 0,
      unit: card.unit,
    };
  });

  // Sort regions descending by riskScore (Greedy heuristic: prioritize extreme threat sectors)
  const prioritizedDisasters = [...disasters].sort((a, b) => b.riskScore - a.riskScore);

  const allocationRecords: ResourceAllocationItem[] = [];
  const shortages: Record<ResourceCategory, number> = {
    FOOD: 0,
    WATER: 0,
    MEDICAL_KITS: 0,
    AMBULANCES: 0,
    HELICOPTERS: 0,
    SHELTERS: 0,
  };

  let recordCounter = 100;

  prioritizedDisasters.forEach((disaster) => {
    const pop = disaster.affectedPopulation;
    const riskFactor = disaster.riskScore / 100;

    // Calculate deterministic demand for this specific zone
    const targetDemands: Record<ResourceCategory, number> = {
      FOOD: Math.round(pop * 0.08 * riskFactor),
      WATER: Math.round(pop * 0.18 * riskFactor),
      MEDICAL_KITS: Math.max(50, Math.round(pop * 0.004 * riskFactor)),
      AMBULANCES: Math.max(2, Math.round((pop / 30000) * riskFactor * 8)),
      HELICOPTERS: disaster.riskScore >= 70 ? Math.max(1, Math.round((pop / 150000) * 4)) : 0,
      SHELTERS: Math.max(5, Math.round((pop / 25000) * 12)),
    };

    // Greedily fulfill demands per category
    (Object.keys(targetDemands) as ResourceCategory[]).forEach((category) => {
      const demanded = targetDemands[category];
      if (demanded <= 0) return;

      const currentStock = inventoryCopy[category];
      const fulfillable = Math.min(demanded, currentStock.remaining);

      if (fulfillable > 0) {
        currentStock.remaining -= fulfillable;
        currentStock.allocated += fulfillable;

        allocationRecords.push({
          id: `RES-DSP-${recordCounter++}`,
          resourceName: `${category.replace('_', ' ')} Relief Taskforce`,
          category,
          quantityAllocated: fulfillable,
          unit: currentStock.unit,
          assignedIncident: disaster.name,
          district: disaster.district,
          coordinatorAgency: 'National Disaster Response Corps (NDRF)',
          dispatchStatus: currentStock.remaining > 0 ? 'DISPATCHED' : 'ON_SITE',
          etaMinutes: Math.floor(15 + Math.random() * 45),
          lastUpdated: 'Just now',
        });
      }

      if (demanded > fulfillable) {
        // Track acute shortage for this resource category
        shortages[category] += demanded - fulfillable;
      }
    });
  });

  // Rebuild updated InventoryCategoryCard array
  const updatedInventory: InventoryCategoryCard[] = currentInventory.map((card) => {
    const stockState = inventoryCopy[card.id];
    const usage = stockState.allocated;
    const remaining = Math.max(0, stockState.total - usage);
    const usageRatio = usage / card.totalStock;

    let status: InventoryCategoryCard['status'] = 'OPTIMAL';
    if (usageRatio >= 0.88 || shortages[card.id] > 0) {
      status = 'CRITICAL';
    } else if (usageRatio >= 0.65) {
      status = 'MODERATE';
    } else if (usageRatio >= 0.4) {
      status = 'LOW';
    }

    return {
      ...card,
      usage,
      remaining,
      status,
      trend: shortages[card.id] > 0
        ? `DEFICIT: -${shortages[card.id].toLocaleString()} ${card.unit}`
        : `${Math.round(usageRatio * 100)}% mobilized`,
    };
  });

  return {
    updatedInventory,
    allocationRecords,
    shortages,
    totalAllocatedCount: allocationRecords.length,
  };
}
