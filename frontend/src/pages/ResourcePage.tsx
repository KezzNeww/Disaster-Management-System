import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Utensils,
  Droplet,
  HeartPulse,
  Truck,
  Navigation,
  Home,
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Layers,
  AlertTriangle,
  Sparkles,
  Bot,
  ArrowDownRight,
} from 'lucide-react';

import { useResourceContext } from '../context/ResourceContext';
import { useDisasterContext } from '../context/DisasterContext';
import { useAI } from '../ai';
import { ResourceAllocationItem } from '../types';
import { StatusBadge } from '../components/enterprise/StatusBadge';
import { SectionHeader } from '../components/enterprise/SectionHeader';
import { Button } from '../components/ui/button';

export function ResourcePage() {
  const {
    inventory,
    allocations,
    shortages,
    runGreedyAllocation,
    replenishStock,
  } = useResourceContext();
  const { disasters } = useDisasterContext();
  const { recommendations } = useAI({ autoFetch: false });

  const aiLogisticsRecs = useMemo(() => {
    return recommendations.filter(
      (r) => r.category === 'RESOURCES' || r.category === 'SUPPLY_CHAIN' || r.category === 'MEDICAL'
    );
  }, [recommendations]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [sortField, setSortField] = useState<keyof ResourceAllocationItem>('quantityAllocated');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 6;

  // Icon mapping for inventory cards
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Utensils':
        return <Utensils className="h-4 w-4 text-amber-400" />;
      case 'Droplet':
        return <Droplet className="h-4 w-4 text-sky-400" />;
      case 'HeartPulse':
        return <HeartPulse className="h-4 w-4 text-red-400" />;
      case 'Truck':
        return <Truck className="h-4 w-4 text-emerald-400" />;
      case 'Navigation':
        return <Navigation className="h-4 w-4 text-blue-400" />;
      case 'Home':
        return <Home className="h-4 w-4 text-purple-400" />;
      default:
        return <Layers className="h-4 w-4 text-slate-400" />;
    }
  };

  // Filtered and sorted allocation dataset from live context
  const filteredAllocations = useMemo(() => {
    return allocations
      .filter((item: ResourceAllocationItem) => {
        if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            item.resourceName.toLowerCase().includes(q) ||
            item.assignedIncident.toLowerCase().includes(q) ||
            item.district.toLowerCase().includes(q) ||
            item.id.toLowerCase().includes(q) ||
            item.coordinatorAgency.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a: ResourceAllocationItem, b: ResourceAllocationItem) => {
        let valA = a[sortField];
        let valB = b[sortField];
        if (typeof valA === 'string') valA = (valA as string).toLowerCase();
        if (typeof valB === 'string') valB = (valB as string).toLowerCase();

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [allocations, searchQuery, selectedCategory, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredAllocations.length / pageSize) || 1;
  const paginatedAllocations = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAllocations.slice(start, start + pageSize);
  }, [filteredAllocations, currentPage]);

  const handleSort = (field: keyof ResourceAllocationItem) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleReplenishAll = () => {
    replenishStock('FOOD', 5000);
    replenishStock('WATER', 10000);
    replenishStock('MEDICAL_KITS', 2000);
    replenishStock('AMBULANCES', 25);
    replenishStock('HELICOPTERS', 8);
    replenishStock('SHELTERS', 100);
  };

  const hasShortages = Object.values(shortages).some((count) => count > 0);

  return (
    <div className="space-y-6 font-mono text-xs select-none">
      {/* Page Section Header */}
      <SectionHeader
        title="CRITICAL RESOURCE INVENTORY & DEPLOYED ALLOCATIONS"
        badgeText="DEFENSE SUPPLY LOGISTICS"
        badgeVariant="telemetry"
        description="Comprehensive real-time tracking of stockpiles, frontline consumption, and tactical asset distribution across active disaster sectors."
        actions={
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleReplenishAll}>
              REPLENISH RESERVE
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => runGreedyAllocation(disasters)}
              className="space-x-1"
            >
              <Sparkles className="h-3 w-3 text-sky-300" />
              <span>EXECUTE GREEDY ALLOCATION</span>
            </Button>
          </div>
        }
      />

      {/* Shortage Audit Banner if active */}
      {hasShortages && (
        <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-red-400 animate-pulse" />
            <span className="font-bold text-red-200">TACTICAL DEFICIT AUDIT:</span>
            <div className="flex flex-wrap gap-1.5 text-[10px]">
              {Object.entries(shortages).map(([cat, count]) =>
                count > 0 ? (
                  <span
                    key={cat}
                    className="px-2 py-0.5 bg-red-900/60 border border-red-700 text-red-300 font-bold rounded-xs"
                  >
                    {cat}: -{count} UNITS
                  </span>
                ) : null
              )}
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-[10px] text-sky-300 border-sky-800 hover:border-sky-600"
            onClick={() => runGreedyAllocation(disasters)}
          >
            RE-RUN ALLOCATION MATRIX
          </Button>
        </div>
      )}

      {/* AI TACTICAL LOGISTICS ADVISORY PANEL */}
      {aiLogisticsRecs.length > 0 && (
        <div className="p-3.5 bg-[#0F172A] border border-blue-500/30 rounded-xs shadow-md space-y-2.5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center space-x-2">
              <Bot className="h-4 w-4 text-blue-400" />
              <span className="font-bold text-white text-xs uppercase tracking-wider">
                AI TACTICAL LOGISTICS ADVISORY // INTELLIGENT ALLOCATION INSIGHTS
              </span>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold border border-emerald-500/30 bg-emerald-950/30 px-2 py-0.5 rounded-xs">
              ADVISORY ONLY
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {aiLogisticsRecs.slice(0, 3).map((rec) => (
              <div
                key={rec.id}
                className="p-3 bg-[#0B0F17] border border-slate-800 rounded-xs hover:border-slate-700 transition-colors space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] px-1.5 py-0.2 rounded-xs bg-blue-950/60 text-blue-400 border border-blue-500/40 font-bold">
                      {rec.category}
                    </span>
                    {rec.impactScoreReduction && (
                      <span className="text-[9px] text-emerald-400 font-bold flex items-center">
                        <ArrowDownRight className="h-3 w-3 mr-0.5" />
                        -{rec.impactScoreReduction}% RISK
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-slate-100 text-xs font-sans">{rec.title}</h4>
                  <p className="text-[11px] text-slate-300 font-sans leading-relaxed">{rec.action}</p>
                </div>

                {rec.reasoning && (
                  <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 font-sans">
                    <strong className="text-slate-300">Justification: </strong>
                    {rec.reasoning}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 1. SIX INVENTORY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {inventory.map((card, index) => {
          const usagePercent = Math.min(Math.round((card.usage / card.totalStock) * 100), 100);
          const isCritical = card.status === 'CRITICAL' || usagePercent >= 85;

          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
              className="p-4 rounded-xs border border-slate-800 bg-[#0F172A] hover:border-slate-700 shadow-sm transition-all relative overflow-hidden"
            >
              {/* Card Top Title & Icon */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-xs bg-[#111827] border border-slate-800">
                    {getIcon(card.categoryIcon)}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-xs leading-none">{card.name}</h3>
                    <span className="text-[10px] text-slate-500 uppercase">{card.id}</span>
                  </div>
                </div>

                <StatusBadge
                  label={card.status}
                  variant={
                    card.status === 'CRITICAL'
                      ? 'critical'
                      : card.status === 'LOW'
                      ? 'high'
                      : card.status === 'MODERATE'
                      ? 'moderate'
                      : 'success'
                  }
                  size="xs"
                />
              </div>

              {/* Metrics: Stock, Usage, Remaining */}
              <div className="grid grid-cols-3 gap-2 py-2 px-2.5 rounded-xs bg-[#111827] border border-slate-800/80 mb-3 text-center">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">TOTAL STOCK</div>
                  <div className="font-bold text-slate-200 text-sm mt-0.5">
                    {card.totalStock.toLocaleString()}
                  </div>
                  <div className="text-[9px] text-slate-500">{card.unit}</div>
                </div>

                <div className="border-x border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase">UTILIZED</div>
                  <div className="font-bold text-amber-400 text-sm mt-0.5">
                    {card.usage.toLocaleString()}
                  </div>
                  <div className="text-[9px] text-slate-500">{usagePercent}%</div>
                </div>

                <div>
                  <div className="text-[10px] text-slate-500 uppercase">REMAINING</div>
                  <div className={`font-bold text-sm mt-0.5 ${isCritical ? 'text-red-400' : 'text-emerald-400'}`}>
                    {card.remaining.toLocaleString()}
                  </div>
                  <div className="text-[9px] text-slate-500">{card.unit}</div>
                </div>
              </div>

              {/* Animated Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>DEPLETION RATE:</span>
                  <span className={isCritical ? 'text-red-400 font-bold' : 'text-slate-300'}>
                    {usagePercent}% Deployed
                  </span>
                </div>
                <div className="h-2 w-full rounded-xs bg-[#111827] overflow-hidden border border-slate-800">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${usagePercent}%` }}
                    transition={{ duration: 0.8, delay: 0.1 + index * 0.05, ease: 'easeOut' }}
                    className={`h-full ${
                      usagePercent >= 85
                        ? 'bg-red-500'
                        : usagePercent >= 65
                        ? 'bg-amber-500'
                        : 'bg-blue-600'
                    }`}
                  />
                </div>
                <div className="text-[10px] text-slate-500 pt-0.5 flex justify-between">
                  <span>Trend: {card.trend}</span>
                  <span className="text-slate-400">Auto-Buffer Lock</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 2. LARGE ALLOCATION TABLE */}
      <div className="rounded-xs border border-slate-800 bg-[#0F172A] shadow-md overflow-hidden">
        {/* Table Filter & Search Controls */}
        <div className="p-3.5 bg-[#111827] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search allocations, squads, or incidents..."
                className="h-8 w-64 sm:w-80 rounded-xs border border-slate-800 bg-[#0F172A] pl-8 pr-3 text-xs text-slate-200 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="h-8 rounded-xs border border-slate-800 bg-[#0F172A] px-2.5 text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
            >
              <option value="ALL">ALL CATEGORIES</option>
              <option value="FOOD">FOOD / RATIONS</option>
              <option value="WATER">WATER PURIFICATION</option>
              <option value="MEDICAL_KITS">MEDICAL TRAUMA</option>
              <option value="AMBULANCES">AMBULANCE FLEET</option>
              <option value="HELICOPTERS">HELICOPTER SORTS</option>
              <option value="SHELTERS">MODULAR SHELTERS</option>
            </select>
          </div>

          <div className="text-slate-400 text-[11px]">
            Showing <strong>{filteredAllocations.length}</strong> active allocation dispatches
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#111827]/80 text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider">
              <tr>
                <th
                  className="p-3 cursor-pointer hover:text-white"
                  onClick={() => handleSort('id')}
                >
                  <div className="flex items-center space-x-1">
                    <span>ID</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  className="p-3 cursor-pointer hover:text-white"
                  onClick={() => handleSort('resourceName')}
                >
                  <div className="flex items-center space-x-1">
                    <span>RESOURCE ASSET NAME</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="p-3">CATEGORY</th>
                <th
                  className="p-3 cursor-pointer hover:text-white text-right"
                  onClick={() => handleSort('quantityAllocated')}
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span>ALLOCATED</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="p-3">ASSIGNED INCIDENT</th>
                <th className="p-3">TARGET DISTRICT</th>
                <th className="p-3">DISPATCH STATUS</th>
                <th
                  className="p-3 cursor-pointer hover:text-white text-right"
                  onClick={() => handleSort('etaMinutes')}
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span>ETA</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {paginatedAllocations.map((item: ResourceAllocationItem) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 text-sky-400 font-bold">{item.id}</td>
                  <td className="p-3 font-sans font-medium text-slate-100">{item.resourceName}</td>
                  <td className="p-3">
                    <span className="text-[10px] px-2 py-0.5 rounded-xs bg-[#111827] border border-slate-700 text-slate-300">
                      {item.category}
                    </span>
                  </td>
                  <td className="p-3 text-right font-bold text-white">
                    {item.quantityAllocated.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">{item.unit}</span>
                  </td>
                  <td className="p-3 font-sans text-slate-300 truncate max-w-xs">{item.assignedIncident}</td>
                  <td className="p-3 text-slate-400">{item.district}</td>
                  <td className="p-3">
                    <StatusBadge
                      label={item.dispatchStatus}
                      variant={
                        item.dispatchStatus === 'ON_SITE'
                          ? 'success'
                          : item.dispatchStatus === 'DISPATCHED' || item.dispatchStatus === 'EN_ROUTE'
                          ? 'telemetry'
                          : 'neutral'
                      }
                    />
                  </td>
                  <td className="p-3 text-right">
                    {item.etaMinutes === 0 ? (
                      <span className="text-emerald-400 font-bold">ON SCENE</span>
                    ) : (
                      <span className="text-sky-400 font-bold">{item.etaMinutes}m</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Controls */}
        <div className="p-3 bg-[#111827] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div>
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="h-7 px-2 space-x-1"
            >
              <ChevronLeft className="h-3 w-3" />
              <span>PREV</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="h-7 px-2 space-x-1"
            >
              <span>NEXT</span>
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
