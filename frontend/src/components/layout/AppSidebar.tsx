import React, { useState } from 'react';
import {
  LayoutDashboard,
  MapPin,
  Flame,
  Truck,
  Route,
  BrainCircuit,
  BarChart3,
  Settings,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Radio,
  Bot,
} from 'lucide-react';
import { SidebarItem } from '../enterprise/SidebarItem';
import { cn } from '../../utils/cn';
import { useAlertContext } from '../../context/AlertContext';

interface AppSidebarProps {
  className?: string;
}

export function AppSidebar({ className = '' }: AppSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { activeCriticalCount } = useAlertContext();

  return (
    <aside
      className={cn(
        'border-r border-slate-800 bg-[#0F172A] flex flex-col justify-between transition-all duration-300 z-30 select-none shrink-0',
        isCollapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* Top Brand Logo */}
      <div>
        <div className="h-14 border-b border-slate-800 flex items-center px-3.5 space-x-3 bg-[#111827]">
          <div className="h-8 w-8 rounded-xs bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center shrink-0">
            <ShieldAlert className="h-5 w-5 text-sky-400" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col truncate">
              <span className="font-mono font-bold text-sm tracking-wider text-white truncate">
                AEGIS COMMAND
              </span>
              <span className="font-mono text-[9px] text-slate-400 tracking-tight">
                NATIONAL DISASTER AI
              </span>
            </div>
          )}
        </div>

        {/* Navigation Section */}
        <div className="py-3 px-2 space-y-1">
          {!isCollapsed && (
            <div className="px-3 pb-2 text-[10px] font-mono tracking-widest text-slate-500 uppercase">
              Operations Console
            </div>
          )}

          <SidebarItem
            to="/"
            label="Dashboard"
            icon={LayoutDashboard}
            isCollapsed={isCollapsed}
          />
          <SidebarItem
            to="/threat-map"
            label="Threat Map"
            icon={MapPin}
            badge="GIS LIVE"
            badgeVariant="telemetry"
            isCollapsed={isCollapsed}
          />
          <SidebarItem
            to="/incidents"
            label="Incidents"
            icon={Flame}
            badge={activeCriticalCount > 0 ? `${activeCriticalCount} ACTIVE` : undefined}
            badgeVariant="critical"
            isCollapsed={isCollapsed}
          />
          <SidebarItem
            to="/resources"
            label="Resources"
            icon={Truck}
            isCollapsed={isCollapsed}
          />
          <SidebarItem
            to="/route-optimizer"
            label="Route Optimizer"
            icon={Route}
            badge="PATH-AI"
            badgeVariant="telemetry"
            isCollapsed={isCollapsed}
          />
          <SidebarItem
            to="/ai-predictions"
            label="AI Predictions"
            icon={BrainCircuit}
            badge="NEURAL"
            badgeVariant="telemetry"
            isCollapsed={isCollapsed}
          />
          <SidebarItem
            to="/ai-command"
            label="AI Command"
            icon={Bot}
            badge="EXPERT"
            badgeVariant="telemetry"
            isCollapsed={isCollapsed}
          />
          <SidebarItem
            to="/analytics"
            label="Analytics"
            icon={BarChart3}
            isCollapsed={isCollapsed}
          />
          <SidebarItem
            to="/settings"
            label="Settings"
            icon={Settings}
            isCollapsed={isCollapsed}
          />
        </div>
      </div>

      {/* Bottom Node Status & Collapse Toggle */}
      <div className="p-2 border-t border-slate-800 bg-[#111827] space-y-1">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-xs transition-colors font-mono text-xs"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <div className="flex items-center space-x-2 w-full px-1">
              <ChevronLeft className="h-4 w-4" />
              <span className="text-[11px]">COLLAPSE CONSOLE</span>
            </div>
          )}
        </button>

        {!isCollapsed && (
          <div className="px-2.5 py-1.5 text-[10px] font-mono text-slate-500 border-t border-slate-800/80 flex items-center justify-between">
            <span className="flex items-center space-x-1">
              <Radio className="h-3 w-3 text-emerald-400 animate-pulse" />
              <span>GRID: ASIA-SOUTH-1</span>
            </span>
            <span className="text-emerald-400 font-bold">OPTIMAL</span>
          </div>
        )}
      </div>
    </aside>
  );
}
