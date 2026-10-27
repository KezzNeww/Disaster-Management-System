import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  InventoryCategoryCard,
  ResourceAllocationItem,
  ResourceCategory,
  DisasterItem,
} from '../types';
import { mockInventoryCards, mockResourceAllocations } from '../mock/mockResources';
import { executeGreedyResourceAllocation } from '../utils/algorithms/resourceAllocation';

interface ResourceContextType {
  inventory: InventoryCategoryCard[];
  allocations: ResourceAllocationItem[];
  shortages: Record<ResourceCategory, number>;
  totalAllocatedUnits: number;
  runGreedyAllocation: (disasters: DisasterItem[]) => void;
  consumeInventoryRandomly: () => void;
  replenishStock: (category: ResourceCategory, amount: number) => void;
  addManualAllocation: (item: Partial<ResourceAllocationItem>) => void;
}

const ResourceContext = createContext<ResourceContextType | undefined>(undefined);

export function ResourceProvider({ children }: { children: React.ReactNode }) {
  const [inventory, setInventory] = useState<InventoryCategoryCard[]>(mockInventoryCards);
  const [allocations, setAllocations] = useState<ResourceAllocationItem[]>(mockResourceAllocations);
  const [shortages, setShortages] = useState<Record<ResourceCategory, number>>({
    FOOD: 0,
    WATER: 0,
    MEDICAL_KITS: 0,
    AMBULANCES: 18,
    HELICOPTERS: 6,
    SHELTERS: 0,
  });

  const totalAllocatedUnits = inventory.reduce((sum, item) => sum + item.usage, 0);

  // Execute Greedy Allocation
  const runGreedyAllocation = useCallback((disasters: DisasterItem[]) => {
    setInventory((prevInv) => {
      const result = executeGreedyResourceAllocation(disasters, prevInv);
      setAllocations(result.allocationRecords);
      setShortages(result.shortages);
      return result.updatedInventory;
    });
  }, []);

  // Simulate depletion during live crisis
  const consumeInventoryRandomly = useCallback(() => {
    setInventory((prev) =>
      prev.map((card) => {
        const delta = Math.floor(card.totalStock * 0.008);
        const newUsage = Math.min(card.totalStock, card.usage + delta);
        const newRemaining = Math.max(0, card.totalStock - newUsage);
        return {
          ...card,
          usage: newUsage,
          remaining: newRemaining,
          trend: `-${delta.toLocaleString()} units consumed`,
        };
      })
    );
  }, []);

  const replenishStock = useCallback((category: ResourceCategory, amount: number) => {
    setInventory((prev) =>
      prev.map((card) => {
        if (card.id === category) {
          const newTotal = card.totalStock + amount;
          const newRemaining = card.remaining + amount;
          return {
            ...card,
            totalStock: newTotal,
            remaining: newRemaining,
            trend: `+${amount.toLocaleString()} replenished`,
          };
        }
        return card;
      })
    );
  }, []);

  const addManualAllocation = useCallback((item: Partial<ResourceAllocationItem>) => {
    const newItem: ResourceAllocationItem = {
      id: `RES-ALC-${Date.now().toString().slice(-4)}`,
      resourceName: item.resourceName || 'Emergency Logistics Unit',
      category: item.category || 'FOOD',
      quantityAllocated: item.quantityAllocated || 1000,
      unit: item.unit || 'Units',
      assignedIncident: item.assignedIncident || 'Sector Rapid Response',
      district: item.district || 'Command Delta',
      coordinatorAgency: item.coordinatorAgency || 'National Disaster Response Authority',
      dispatchStatus: 'DISPATCHED',
      etaMinutes: 25,
      lastUpdated: 'Just now',
    };
    setAllocations((prev) => [newItem, ...prev]);
  }, []);

  return (
    <ResourceContext.Provider
      value={{
        inventory,
        allocations,
        shortages,
        totalAllocatedUnits,
        runGreedyAllocation,
        consumeInventoryRandomly,
        replenishStock,
        addManualAllocation,
      }}
    >
      {children}
    </ResourceContext.Provider>
  );
}

export function useResourceContext() {
  const context = useContext(ResourceContext);
  if (!context) {
    throw new Error('useResourceContext must be used within a ResourceProvider');
  }
  return context;
}
