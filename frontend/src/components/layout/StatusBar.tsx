import React from 'react';
import { Database, Wifi, ShieldCheck, Activity, Cpu, Radio, Server } from 'lucide-react';
import { useSimulationContext } from '../../context/SimulationContext';

export function StatusBar() {
  const { isSimulationActive, tickCount, lastTickTime } = useSimulationContext();

  return (
    <footer className="h-7 border-t border-slate-800 bg-[#0B0F17] px-4 flex items-center justify-between text-[10px] font-mono text-slate-400 select-none z-30">
      {/* Left Status Chips */}
      <div className="flex items-center space-x-3 overflow-hidden">
        {/* Live Telemetry Ping */}
        <div className="flex items-center space-x-1.5 text-emerald-400 shrink-0">
          <Radio className="h-3 w-3 animate-pulse" />
          <span className="font-semibold">TELEMETRY: CONNECTED (14ms)</span>
        </div>

        <span className="text-slate-700 hidden sm:inline">|</span>

        {/* Simulation Mode Badge */}
        <div className="flex items-center space-x-1.5 shrink-0">
          <Activity
            className={`h-3 w-3 ${
              isSimulationActive ? 'text-emerald-400 animate-pulse' : 'text-amber-400'
            }`}
          />
          <span>
            SIMULATION:{' '}
            <strong className={isSimulationActive ? 'text-emerald-400' : 'text-amber-400'}>
              {isSimulationActive ? `ACTIVE (5s) [#${tickCount}]` : 'PAUSED'}
            </strong>
          </span>
        </div>

        <span className="text-slate-700 hidden md:inline">|</span>

        {/* Backend & State Architecture */}
        <div className="hidden md:flex items-center space-x-1.5 text-slate-400 shrink-0">
          <Server className="h-3 w-3 text-sky-400" />
          <span>BACKEND: CLIENT-SIDE ENGINE (MOCK TELEMETRY)</span>
        </div>

        <span className="text-slate-700 hidden lg:inline">|</span>

        {/* System Health */}
        <div className="hidden lg:flex items-center space-x-1.5 text-slate-400 shrink-0">
          <Cpu className="h-3 w-3 text-blue-400" />
          <span>ALGORITHMS: DIJKSTRA & WEIGHTED SCORING ONLINE</span>
        </div>
      </div>

      {/* Right Status Metrics */}
      <div className="flex items-center space-x-3 text-slate-400 shrink-0">
        <div className="hidden sm:flex items-center space-x-1 text-slate-400">
          <span className="text-slate-500">PROTOTYPE:</span>
          <span className="text-slate-300 font-bold">v4.8.2</span>
        </div>

        <span className="text-slate-700 hidden sm:inline">|</span>

        <div className="flex items-center space-x-1 text-slate-400">
          <span className="text-slate-500">LAST MUTATION:</span>
          <span className="text-sky-400 font-bold">{lastTickTime}</span>
        </div>

        <span className="text-slate-700 hidden sm:inline">|</span>

        <div className="flex items-center space-x-1 text-emerald-400">
          <ShieldCheck className="h-3 w-3" />
          <span className="hidden sm:inline font-bold">DEFCON-2 ELEVATED</span>
        </div>
      </div>
    </footer>
  );
}
