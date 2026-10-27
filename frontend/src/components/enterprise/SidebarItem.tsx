import React from 'react';
import { NavLink } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

interface SidebarItemProps {
  to: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
  badgeVariant?: 'critical' | 'telemetry' | 'default';
  isCollapsed?: boolean;
}

export function SidebarItem({
  to,
  label,
  icon: Icon,
  badge,
  badgeVariant = 'default',
  isCollapsed = false,
}: SidebarItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'flex items-center space-x-3 px-3 py-2 rounded-xs text-xs font-mono transition-colors group relative select-none',
          isActive
            ? 'bg-blue-600/20 text-sky-400 border-l-2 border-blue-500 font-semibold'
            : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
        )
      }
      title={isCollapsed ? label : undefined}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {!isCollapsed && (
        <div className="flex items-center justify-between flex-1 truncate">
          <span className="truncate">{label}</span>
          {badge && (
            <span
              className={cn(
                'text-[9px] px-1.5 py-0.2 rounded-xs font-mono font-bold tracking-tight',
                badgeVariant === 'critical' &&
                  'bg-red-950/80 text-red-400 border border-red-800',
                badgeVariant === 'telemetry' &&
                  'bg-sky-950/80 text-sky-400 border border-sky-800',
                badgeVariant === 'default' &&
                  'bg-slate-800 text-slate-300 border border-slate-700'
              )}
            >
              {badge}
            </span>
          )}
        </div>
      )}
    </NavLink>
  );
}
