import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ShieldAlert,
  Wind,
  Droplets,
  CloudRain,
  Thermometer,
  Users,
  Compass,
  Radio,
  Share2,
  ExternalLink,
} from 'lucide-react';
import { DisasterItem } from '../../types';
import { StatusBadge } from '../enterprise/StatusBadge';
import { RiskIndicator } from '../enterprise/RiskIndicator';
import { MetricRow } from '../enterprise/MetricRow';
import { Button } from '../ui/button';

interface DisasterSidePanelProps {
  disaster: DisasterItem | null;
  onClose: () => void;
  onOpenAISimulator?: (disaster: DisasterItem) => void;
}

export function DisasterSidePanel({
  disaster,
  onClose,
  onOpenAISimulator,
}: DisasterSidePanelProps) {
  return (
    <AnimatePresence>
      {disaster && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="absolute right-0 top-0 bottom-0 z-30 w-full sm:w-[420px] bg-[#0F172A]/95 border-l border-slate-800 shadow-2xl backdrop-blur-md flex flex-col font-mono text-xs select-none"
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-800 bg-[#111827] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="h-4 w-4 text-red-400" />
              <span className="font-bold text-white text-xs uppercase tracking-wider">
                TACTICAL INCIDENT INTEL
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {/* Title & Status */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sky-400 font-bold">{disaster.id}</span>
                <StatusBadge
                  label={disaster.severity}
                  variant={
                    disaster.severity === 'CRITICAL'
                      ? 'critical'
                      : disaster.severity === 'HIGH'
                      ? 'high'
                      : 'moderate'
                  }
                  pulse={disaster.severity === 'CRITICAL'}
                />
              </div>
              <h2 className="text-base font-bold font-sans text-white leading-tight">
                {disaster.name}
              </h2>
              <div className="text-[11px] text-slate-400 mt-1">
                {disaster.district}, {disaster.state}, {disaster.country}
              </div>
            </div>

            {/* Risk Indicator */}
            <div className="p-3 rounded-xs bg-[#111827] border border-slate-800">
              <RiskIndicator score={disaster.riskScore} size="lg" />
            </div>

            {/* Summary */}
            <div className="p-3 rounded-xs bg-[#111827] border border-slate-800">
              <div className="text-[10px] uppercase text-slate-500 font-bold mb-1">
                SITUATION REPORT
              </div>
              <p className="text-xs font-sans text-slate-300 leading-relaxed">
                {disaster.summary}
              </p>
            </div>

            {/* Weather Sensor Telemetry */}
            <div className="p-3 rounded-xs bg-[#111827] border border-slate-800 space-y-2">
              <div className="text-[10px] uppercase text-slate-500 font-bold flex items-center justify-between">
                <span>LOCAL WEATHER TELEMETRY</span>
                <span className="text-sky-400">IMD AWS SYNC</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="flex items-center space-x-2 text-slate-300">
                  <Wind className="h-3.5 w-3.5 text-sky-400" />
                  <span>{disaster.weather.windSpeedKmh} km/h wind</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-300">
                  <Thermometer className="h-3.5 w-3.5 text-amber-400" />
                  <span>{disaster.weather.temperatureC}°C ambient</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-300">
                  <Droplets className="h-3.5 w-3.5 text-blue-400" />
                  <span>{disaster.weather.humidityPercent}% humidity</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-300">
                  <CloudRain className="h-3.5 w-3.5 text-sky-400" />
                  <span>{disaster.weather.precipitationMmH} mm/h rain</span>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="space-y-0.5">
              <MetricRow
                label="POPULATION AT RISK"
                value={`${disaster.affectedPopulation.toLocaleString()} citizens`}
              />
              <MetricRow
                label="RADIAL THREAT ZONE"
                value={`${disaster.radiusKm} km radius`}
              />
              <MetricRow
                label="DEPLOYED EMERGENCY TEAMS"
                value={`${disaster.emergencyTeamsDeployed} squads active`}
              />
              <MetricRow
                label="OPEN RELIEF SHELTERS"
                value={`${disaster.sheltersOpen} designated hubs`}
              />
              <MetricRow
                label="GEOSPATIAL COORDS"
                value={`${disaster.coordinates.lat.toFixed(4)}° N, ${disaster.coordinates.lng.toFixed(4)}° E`}
              />
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="p-4 border-t border-slate-800 bg-[#111827] space-y-2">
            <Button
              variant="default"
              className="w-full justify-center text-xs"
              onClick={() => {
                if (onOpenAISimulator) onOpenAISimulator(disaster);
              }}
            >
              RUN NEURAL SPREAD PREDICTION
            </Button>
            <div className="flex space-x-2">
              <Button variant="outline" className="flex-1 justify-center text-[11px]">
                DISPATCH RESCUE
              </Button>
              <Button variant="destructive" className="flex-1 justify-center text-[11px]">
                BROADCAST CAP
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
