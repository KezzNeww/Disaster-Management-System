import React, { useState, useMemo } from 'react';
import {
  Filter,
  Search,
  Crosshair,
  RotateCcw,
  Eye,
  EyeOff,
  Bot,
  Zap,
} from 'lucide-react';
import { useDisasterContext } from '../context/DisasterContext';
import { useAI } from '../ai';
import { DisasterItem } from '../types';
import { DisasterMap } from '../components/map/DisasterMap';
import { DisasterSidePanel } from '../components/map/DisasterSidePanel';
import { HeatLegend } from '../components/enterprise/HeatLegend';
import { Button } from '../components/ui/button';

export function ThreatMapPage() {
  const { disasters, selectedDisaster, selectDisaster } = useDisasterContext();
  const { recommendations, threatLevel } = useAI({ autoFetch: false });
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [searchDistrict, setSearchDistrict] = useState<string>('');
  const [showHeatCircles, setShowHeatCircles] = useState<boolean>(true);
  const [showAIOverlays, setShowAIOverlays] = useState<boolean>(true);
  const [mapCenter, setMapCenter] = useState<[number, number]>([21.5, 82.5]);
  const [mapZoom, setMapZoom] = useState<number>(5);

  // Filtered dataset
  const filteredDisasters = useMemo(() => {
    return disasters.filter((item: DisasterItem) => {
      if (selectedType !== 'ALL' && item.type !== selectedType) return false;
      if (selectedSeverity !== 'ALL' && item.severity !== selectedSeverity) return false;
      if (
        searchDistrict.trim() &&
        !item.district.toLowerCase().includes(searchDistrict.toLowerCase()) &&
        !item.name.toLowerCase().includes(searchDistrict.toLowerCase()) &&
        !item.state.toLowerCase().includes(searchDistrict.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [disasters, selectedType, selectedSeverity, searchDistrict]);

  const totalAffected = useMemo(() => {
    return filteredDisasters.reduce((acc: number, curr: DisasterItem) => acc + curr.affectedPopulation, 0);
  }, [filteredDisasters]);

  const criticalCount = useMemo(() => {
    return filteredDisasters.filter((d: DisasterItem) => d.severity === 'CRITICAL').length;
  }, [filteredDisasters]);

  const handleResetFilters = () => {
    setSelectedType('ALL');
    setSelectedSeverity('ALL');
    setSearchDistrict('');
    setMapCenter([21.5, 82.5]);
    setMapZoom(5);
  };

  return (
    <div className="h-[calc(100vh-7.5rem)] flex flex-col space-y-3 font-mono">
      {/* 1. TOP TACTICAL FILTER BAR */}
      <div className="p-3 bg-[#0F172A] border border-slate-800 rounded-xs shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs select-none">
        {/* Left: Quick Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-1.5 text-slate-300 font-bold">
            <Filter className="h-4 w-4 text-sky-400" />
            <span>GIS FILTERS:</span>
          </div>

          {/* Disaster Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="h-8 rounded-xs border border-slate-800 bg-[#111827] px-2.5 text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
          >
            <option value="ALL">ALL TYPES ({disasters.length})</option>
            <option value="CYCLONE">CYCLONE</option>
            <option value="FLOOD">FLOOD</option>
            <option value="EARTHQUAKE">EARTHQUAKE</option>
            <option value="FIRE">FIRE</option>
          </select>

          {/* Risk Severity Filter */}
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="h-8 rounded-xs border border-slate-800 bg-[#111827] px-2.5 text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
          >
            <option value="ALL">ALL SEVERITY TIERS</option>
            <option value="CRITICAL">CRITICAL ONLY</option>
            <option value="HIGH">HIGH ONLY</option>
            <option value="MODERATE">MODERATE ONLY</option>
            <option value="LOW">LOW ONLY</option>
          </select>

          {/* District / Keyword Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              value={searchDistrict}
              onChange={(e) => setSearchDistrict(e.target.value)}
              placeholder="Search district or state..."
              className="h-8 w-48 sm:w-56 rounded-xs border border-slate-800 bg-[#111827] pl-8 pr-2 text-xs text-slate-200 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Heat Circles Toggle */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowHeatCircles(!showHeatCircles)}
            className="space-x-1 text-slate-300"
          >
            {showHeatCircles ? <Eye className="h-3.5 w-3.5 text-emerald-400" /> : <EyeOff className="h-3.5 w-3.5 text-slate-500" />}
            <span>HEAT CIRCLES</span>
          </Button>

          {/* AI Tactical Overlays Toggle */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowAIOverlays(!showAIOverlays)}
            className="space-x-1 text-slate-300 border-blue-500/40"
          >
            <Bot className={`h-3.5 w-3.5 ${showAIOverlays ? 'text-blue-400' : 'text-slate-500'}`} />
            <span>AI OVERLAYS</span>
          </Button>

          {(selectedType !== 'ALL' || selectedSeverity !== 'ALL' || searchDistrict) && (
            <button
              onClick={handleResetFilters}
              className="text-sky-400 hover:text-sky-300 flex items-center space-x-1 text-xs"
            >
              <RotateCcw className="h-3 w-3" />
              <span>RESET</span>
            </button>
          )}
        </div>

        {/* Right: Quick Summary Counts */}
        <div className="flex items-center space-x-3 text-[11px] text-slate-400">
          <span>MATCHING: <strong className="text-white">{filteredDisasters.length}</strong></span>
          <span>CRITICAL: <strong className="text-red-400">{criticalCount}</strong></span>
          <span>AFFECTED: <strong className="text-sky-400">{(totalAffected / 1000000).toFixed(2)}M</strong></span>
        </div>
      </div>

      {/* 2. MAIN FULLSCREEN MAP VIEWPORT */}
      <div className="flex-1 rounded-xs border border-slate-800 bg-[#0B0F17] relative overflow-hidden shadow-2xl">
        <DisasterMap
          disasters={filteredDisasters}
          selectedDisaster={selectedDisaster}
          onSelectDisaster={(d: DisasterItem) => selectDisaster(d)}
          showHeatCircles={showHeatCircles}
          showAIOverlays={showAIOverlays}
          center={mapCenter}
          zoom={mapZoom}
          height="100%"
        />

        {/* Top-Left Floating Tactical HUD Info & AI Advisory */}
        <div className="absolute top-4 left-4 z-10 w-80 bg-[#0F172A]/90 border border-slate-800 p-3 rounded-xs backdrop-blur-md shadow-xl text-xs space-y-2.5 hidden md:block select-none">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="font-bold text-white text-[11px]">SATELLITE & AI TELEMETRY</span>
            <span className="text-emerald-400 text-[10px] flex items-center space-x-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span>LIVE</span>
            </span>
          </div>

          <div className="space-y-1 text-[11px] text-slate-400">
            <div className="flex justify-between">
              <span>SURVEILLANCE:</span>
              <span className="text-slate-200">INSAT-3DR / SATELLITE CONSTELLATION</span>
            </div>
            <div className="flex justify-between">
              <span>AI THREAT LEVEL:</span>
              <span className="text-rose-400 font-bold">{threatLevel} TIER</span>
            </div>
            <div className="flex justify-between">
              <span>EVACUATION VECTOR:</span>
              <span className="text-emerald-400 font-bold">Inland Ridge Spine (+18m)</span>
            </div>
          </div>

          {/* AI Recommendation Snapshot */}
          {recommendations.length > 0 && (
            <div className="pt-2 border-t border-slate-800 space-y-1">
              <div className="flex items-center space-x-1 text-[10px] text-blue-400 font-bold uppercase">
                <Zap className="h-3 w-3" />
                <span>AI TACTICAL DIRECTIVE</span>
              </div>
              <p className="text-[11px] text-slate-200 font-sans line-clamp-2">
                {recommendations[0].action}
              </p>
            </div>
          )}
        </div>

        {/* Bottom-Left Floating Heat Legend */}
        <div className="absolute bottom-4 left-4 z-10 hidden sm:block">
          <HeatLegend />
        </div>

        {/* Top-Right Re-center Button */}
        <div className="absolute top-4 right-4 z-10">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setMapCenter([21.5, 82.5]);
              setMapZoom(5);
            }}
            className="space-x-1 bg-[#0F172A]/90 backdrop-blur-md text-slate-200"
          >
            <Crosshair className="h-3.5 w-3.5 text-emerald-400" />
            <span>RE-CENTER MAP</span>
          </Button>
        </div>

        {/* 3. SLIDING DETAILS PANEL */}
        <DisasterSidePanel
          disaster={selectedDisaster}
          onClose={() => selectDisaster(null)}
        />
      </div>
    </div>
  );
}
