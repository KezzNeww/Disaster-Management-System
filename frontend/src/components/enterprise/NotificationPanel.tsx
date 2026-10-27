import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Clock } from 'lucide-react';
import { LiveAlertItem } from '../../mock/mockAlerts';
import { StatusBadge } from './StatusBadge';
import { useAlertContext } from '../../context/AlertContext';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAlert?: (alert: LiveAlertItem) => void;
}

export function NotificationPanel({
  isOpen,
  onClose,
  onSelectAlert,
}: NotificationPanelProps) {
  const { alerts, resolveAlert } = useAlertContext();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-96 border-l border-slate-800 bg-[#0F172A] shadow-2xl flex flex-col font-mono"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#111827]">
              <div className="flex items-center space-x-2">
                <Bell className="h-4 w-4 text-sky-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  TACTICAL DISPATCH FEED ({alerts.length})
                </span>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-200 transition-colors p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
              {alerts.map((alert) => {
                const isCritical = alert.priority === 'CRITICAL';
                return (
                  <div
                    key={alert.id}
                    onClick={() => {
                      if (onSelectAlert) onSelectAlert(alert);
                    }}
                    className={`p-3 rounded-xs border transition-colors cursor-pointer text-xs ${
                      isCritical
                        ? 'bg-red-950/20 border-red-500/40 hover:border-red-500'
                        : 'bg-[#111827] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <StatusBadge
                        label={alert.priority}
                        variant={
                          alert.priority === 'CRITICAL'
                            ? 'critical'
                            : alert.priority === 'HIGH'
                            ? 'high'
                            : 'moderate'
                        }
                        pulse={isCritical}
                      />
                      <span className="text-[10px] text-slate-500 flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{alert.timestamp}</span>
                      </span>
                    </div>

                    <p className="text-xs font-sans text-slate-200 font-medium mb-1">
                      {alert.description}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-800/80">
                      <span>{alert.location}</span>
                      <span className="text-sky-400">{alert.sourceAgency}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-slate-800 bg-[#111827] flex items-center justify-between text-[11px] text-slate-400">
              <span>ACTIVE TELEMETRY HOOK</span>
              <span className="text-emerald-400 font-bold">LIVE STREAMING</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
