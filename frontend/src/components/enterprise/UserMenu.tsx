import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, Settings, LogOut, Radio, Key, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

interface UserMenuProps {
  className?: string;
}

export function UserMenu({ className = '' }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-1 rounded-xs hover:bg-slate-800/80 transition-colors focus:outline-none group"
        title="Incident Commander Console & Clearance"
      >
        <div className="h-7 w-7 rounded-xs bg-blue-950/70 border border-blue-500/50 text-sky-400 flex items-center justify-center font-mono text-xs select-none shadow-sm group-hover:border-blue-400 transition-colors">
          <ShieldAlert className="h-4 w-4 text-sky-400" />
        </div>
        <div className="hidden xl:flex flex-col text-left font-mono text-xs leading-none">
          <span className="text-slate-200 font-semibold text-[11px] tracking-tight">INCIDENT COMMANDER</span>
          <span className="text-[9px] text-slate-500 tracking-tight">CLEARANCE: LEVEL-4</span>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-xs border border-slate-800 bg-[#0F172A] shadow-2xl py-2 z-50 font-mono text-xs animate-in fade-in zoom-in-95 duration-150">
          {/* Operational Identity */}
          <div className="px-3 py-2 border-b border-slate-800">
            <div className="flex items-center space-x-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <div className="font-bold text-white text-xs">INCIDENT COMMANDER</div>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Control Room Operator #04</div>
            <div className="text-[9px] text-slate-500">National Emergency Operations Center</div>
            <div className="mt-1.5 flex items-center space-x-1.5 text-[10px] text-emerald-400">
              <ShieldCheck className="h-3 w-3" />
              <span>DEFCON-2 ELEVATED CLEARANCE</span>
            </div>
          </div>

          {/* Operational Links */}
          <div className="py-1">
            <Link
              to="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-2 px-3 py-2 text-slate-300 hover:bg-slate-800/60 hover:text-white transition-colors"
            >
              <Settings className="h-3.5 w-3.5 text-slate-400" />
              <span>OPERATIONAL SETTINGS</span>
            </Link>

            <div className="flex items-center space-x-2 px-3 py-2 text-slate-400 hover:bg-slate-800/60 transition-colors cursor-pointer">
              <Radio className="h-3.5 w-3.5 text-sky-400" />
              <span>SENSOR TELEMETRY FEEDS</span>
            </div>
          </div>

          {/* Terminal Lock */}
          <div className="border-t border-slate-800 pt-1 mt-1">
            <div className="flex items-center space-x-2 px-3 py-2 text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer">
              <LogOut className="h-3.5 w-3.5" />
              <span>LOCK OPERATOR CONSOLE</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
