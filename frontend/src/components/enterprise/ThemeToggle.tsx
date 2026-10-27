import React from 'react';
import { Moon } from 'lucide-react';

export function ThemeToggle() {
  return (
    <div
      className="flex items-center space-x-1.5 px-2 py-1 rounded-xs border border-slate-800 bg-[#111827] text-slate-300 font-mono text-[10px] select-none"
      title="System Theme: Enterprise Dark Mode"
    >
      <Moon className="h-3 w-3 text-sky-400" />
      <span className="hidden md:inline text-slate-400">DARK ONLY</span>
    </div>
  );
}
