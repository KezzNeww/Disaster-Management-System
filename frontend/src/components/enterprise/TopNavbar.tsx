import React, { useState, useEffect } from 'react';
import { Bell, Clock, AlertTriangle, Play, Pause, Activity } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { UserMenu } from './UserMenu';
import { ThemeToggle } from './ThemeToggle';
import { NotificationPanel } from './NotificationPanel';
import { useDisasterContext } from '../../context/DisasterContext';
import { useAlertContext } from '../../context/AlertContext';
import { useSimulationContext } from '../../context/SimulationContext';

interface TopNavbarProps {
  onSearch?: (query: string) => void;
  className?: string;
}

export function TopNavbar({ onSearch, className = '' }: TopNavbarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [utcTime, setUtcTime] = useState('');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const { currentDisaster } = useDisasterContext();
  const { activeCriticalCount } = useAlertContext();
  const { isSimulationActive, toggleSimulation, tickCount } = useSimulationContext();

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setUtcTime(now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC');
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (onSearch) onSearch(query);
  };

  return (
    <>
      <header
        className={`h-14 border-b border-slate-800 bg-[#0F172A] px-4 flex items-center justify-between select-none z-40 sticky top-0 ${className}`}
      >
        {/* Left: Search Bar */}
        <div className="flex items-center space-x-3 w-64 sm:w-80 md:w-96">
          <SearchBar
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search telemetry, GIS coords, or ID..."
            className="w-full"
          />
        </div>

        {/* Center: Current Disaster Status & UTC Clock */}
        <div className="hidden lg:flex items-center space-x-3 font-mono text-xs">
          {/* Current Disaster Status */}
          <div className="flex items-center space-x-2 bg-[#111827] px-2.5 py-1 rounded-xs border border-slate-800">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            <span className="text-slate-400 text-[10px]">HAZARD:</span>
            <span className="text-white font-bold truncate max-w-[180px]">
              {currentDisaster?.name || 'Monitoring'}
            </span>
            <span className="text-red-400 font-bold text-[10px]">
              (RISK: {currentDisaster?.riskScore})
            </span>
          </div>

          {/* Live 5s Simulation Controller Button */}
          <button
            onClick={toggleSimulation}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-xs border font-mono text-[10px] font-bold transition-colors ${
              isSimulationActive
                ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/40 hover:bg-emerald-950/60'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
            title="Click to Pause/Resume 5-second disaster mutation simulation"
          >
            {isSimulationActive ? (
              <>
                <Activity className="h-3 w-3 animate-pulse text-emerald-400" />
                <span>SIM: LIVE (5S) #{tickCount}</span>
              </>
            ) : (
              <>
                <Pause className="h-3 w-3 text-amber-400" />
                <span>SIM: PAUSED</span>
              </>
            )}
          </button>

          {/* Live Telemetry Ping */}
          <div className="hidden 2xl:flex items-center space-x-1.5 px-2 py-0.5 rounded-xs bg-emerald-950/30 border border-emerald-500/30 text-emerald-400 text-[10px]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>LIVE TELEMETRY</span>
          </div>

          {/* Prototype / Standalone Badge */}
          <div className="hidden xl:flex items-center space-x-1.5 px-2 py-0.5 rounded-xs bg-slate-800/70 border border-slate-700/60 text-[9px] text-slate-400">
            <span className="text-slate-300 font-semibold">STANDALONE DEMO</span>
            <span className="text-slate-600">|</span>
            <span className="text-sky-400">MOCK TELEMETRY</span>
          </div>

          {/* Current Time Clock */}
          <div className="flex items-center space-x-1.5 text-slate-400 text-[11px]">
            <Clock className="h-3.5 w-3.5 text-sky-400" />
            <span>{utcTime || 'SYNCHRONIZING...'}</span>
          </div>
        </div>

        {/* Right: Global Alert Indicator, Notification Bell, Theme, Profile */}
        <div className="flex items-center space-x-3">
          {/* Global Alert Indicator */}
          <div
            onClick={() => setIsNotificationsOpen(true)}
            className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-xs bg-red-950/40 border border-red-500/40 text-red-400 font-mono text-[10px] font-bold cursor-pointer hover:bg-red-950/60 transition-colors"
          >
            <AlertTriangle className="h-3 w-3 animate-pulse" />
            <span>{activeCriticalCount} CRITICAL THREATS</span>
          </div>

          {/* Notification Bell */}
          <button
            onClick={() => setIsNotificationsOpen(true)}
            className="relative p-1.5 rounded-xs hover:bg-slate-800/80 text-slate-300 hover:text-white transition-colors"
            title="Open Tactical Feed"
          >
            <Bell className="h-4 w-4" />
            {activeCriticalCount > 0 && (
              <span className="absolute top-1 right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
            )}
          </button>

          {/* Theme Indicator */}
          <ThemeToggle />

          <div className="h-4 w-[1px] bg-slate-800" />

          {/* Profile User Menu */}
          <UserMenu />
        </div>
      </header>

      {/* Slide-out Notification Feed */}
      <NotificationPanel
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </>
  );
}
