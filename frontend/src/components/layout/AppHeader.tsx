import { useState, useEffect } from 'react';
import { ShieldAlert, Bell, Radio, Activity, Cpu } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

export function AppHeader() {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-14 border-b border-slate-800 bg-[#0F172A] px-4 flex items-center justify-between select-none z-40 sticky top-0">
      {/* Brand & System Code */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center justify-center h-8 w-8 rounded-xs bg-blue-600/20 border border-blue-500/40 text-blue-400">
          <ShieldAlert className="h-5 w-5 text-blue-400" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-sm tracking-wider text-slate-100 font-mono">
              AEGIS-DISASTER-AI
            </span>
            <Badge variant="telemetry" className="text-[10px] px-1.5 py-0">
              DISASTER OPS ENGINE v4.8
            </Badge>
          </div>
          <p className="text-[10px] text-slate-400 font-mono tracking-tight hidden sm:block">
            GEOSPATIAL INCIDENT COMMAND & AUTONOMOUS DISPATCH SYSTEM
          </p>
        </div>
      </div>

      {/* Center Mission Status */}
      <div className="hidden lg:flex items-center space-x-4 font-mono text-xs text-slate-400">
        <div className="flex items-center space-x-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-slate-300">DEFCON 3: ELEVATED READINESS</span>
        </div>
        <span className="text-slate-700">|</span>
        <div className="flex items-center space-x-1 text-slate-400">
          <Cpu className="h-3.5 w-3.5 text-sky-400" />
          <span>NEURAL PROPAGATION: ACTIVE</span>
        </div>
        <span className="text-slate-700">|</span>
        <div className="text-slate-400">
          <span>UTC: {time || 'SYNCHRONIZING...'}</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" className="hidden md:inline-flex items-center space-x-1 text-slate-300">
          <Radio className="h-3.5 w-3.5 text-sky-400 animate-pulse" />
          <span>TELEMETRY FEED</span>
        </Button>

        <Button variant="ghost" size="icon" className="relative text-slate-300 hover:text-slate-100">
          <Bell className="h-4 w-4 text-slate-300" />
          <span className="absolute top-1 right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
        </Button>

        <div className="h-4 w-[1px] bg-slate-800 hidden sm:block" />

        {/* Commander Profile */}
        <div className="flex items-center space-x-2 pl-1">
          <div className="h-7 w-7 rounded-xs bg-blue-950/70 border border-blue-500/50 flex items-center justify-center font-mono text-xs text-sky-400 font-semibold shadow-sm">
            <ShieldAlert className="h-4 w-4 text-sky-400" />
          </div>
          <div className="hidden xl:block text-left font-mono">
            <div className="text-xs text-slate-200 leading-tight">INCIDENT COMMANDER</div>
            <div className="text-[10px] text-slate-400">CLEARANCE: LEVEL-4</div>
          </div>
        </div>
      </div>
    </header>
  );
}
