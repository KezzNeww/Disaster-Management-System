import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  ShieldAlert,
  X,
  RefreshCw,
} from 'lucide-react';
import { useAlertContext } from '../context/AlertContext';
import { LiveAlertItem } from '../mock/mockAlerts';
import { StatusBadge } from '../components/enterprise/StatusBadge';
import { SectionHeader } from '../components/enterprise/SectionHeader';
import { Button } from '../components/ui/button';

export function IncidentCommandPage() {
  const {
    alerts,
    resolveAlert,
    updateAlertStatus,
    triggerNewSimulationAlert,
  } = useAlertContext();

  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedIncident, setSelectedIncident] = useState<LiveAlertItem | null>(null);

  const filtered = useMemo(() => {
    return alerts.filter((item) => {
      if (filterSeverity !== 'ALL' && item.priority !== filterSeverity) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.id.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.sourceAgency.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [alerts, filterSeverity, searchQuery]);

  const handleStatusChange = (id: string, newStatus: LiveAlertItem['status']) => {
    updateAlertStatus(id, newStatus);
  };

  return (
    <div className="space-y-6 font-mono text-xs select-none">
      <SectionHeader
        title="TACTICAL MULTI-AGENCY INCIDENT COMMAND QUEUE"
        badgeText="TRIAGE INTERACTION ENGINE"
        badgeVariant="critical"
        description="Priority-ranked operational incident ingestion feed synchronized with state emergency dispatch authorities."
        actions={
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={triggerNewSimulationAlert}
              className="space-x-1"
            >
              <RefreshCw className="h-3 w-3" />
              <span>SYNC CWC & IMD SENSORS</span>
            </Button>
            <Button
              variant="default"
              size="sm"
              className="space-x-1"
              onClick={triggerNewSimulationAlert}
            >
              <Plus className="h-3.5 w-3.5" />
              <span>LOG MANUAL SITREP</span>
            </Button>
          </div>
        }
      />

      {/* Filter and Search Bar */}
      <div className="p-3 bg-[#0F172A] border border-slate-800 rounded-xs flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by incident ID, agency, or region..."
              className="h-8 w-64 sm:w-80 rounded-xs border border-slate-800 bg-[#111827] pl-8 pr-3 text-xs text-slate-200 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center space-x-1.5">
            {['ALL', 'CRITICAL', 'HIGH', 'MODERATE', 'LOW'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilterSeverity(lvl)}
                className={`px-2.5 py-1 rounded-xs text-[10px] uppercase font-bold border transition-colors ${
                  filterSeverity === lvl
                    ? 'bg-blue-600 text-white border-blue-500'
                    : 'bg-[#111827] text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        <div className="text-slate-400 text-[11px]">
          Showing <strong>{filtered.length}</strong> incidents in queue
        </div>
      </div>

      {/* Tactical Incident Table */}
      <div className="rounded-xs border border-slate-800 bg-[#0F172A] shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#111827] text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="p-3">INCIDENT ID</th>
                <th className="p-3">PRIORITY</th>
                <th className="p-3">TYPE</th>
                <th className="p-3">TACTICAL HEADLINE</th>
                <th className="p-3">LOCATION</th>
                <th className="p-3">SOURCE AGENCY</th>
                <th className="p-3">STATUS</th>
                <th className="p-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filtered.map((inc) => (
                <tr key={inc.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 text-sky-400 font-bold">{inc.id}</td>
                  <td className="p-3">
                    <StatusBadge
                      label={inc.priority}
                      variant={
                        inc.priority === 'CRITICAL'
                          ? 'critical'
                          : inc.priority === 'HIGH'
                          ? 'high'
                          : 'moderate'
                      }
                      pulse={inc.priority === 'CRITICAL'}
                    />
                  </td>
                  <td className="p-3 text-white font-semibold">{inc.type}</td>
                  <td className="p-3 font-sans text-slate-200 max-w-sm">
                    <div className="font-medium truncate">{inc.description}</div>
                    <div className="text-[10px] text-slate-500 font-mono">Logged: {inc.timestamp}</div>
                  </td>
                  <td className="p-3 text-slate-300">{inc.location}</td>
                  <td className="p-3 text-slate-400">{inc.sourceAgency}</td>
                  <td className="p-3">
                    <select
                      value={inc.status}
                      onChange={(e) => handleStatusChange(inc.id, e.target.value as LiveAlertItem['status'])}
                      className="h-7 rounded-xs border border-slate-800 bg-[#111827] px-2 text-[10px] text-slate-300 focus:outline-none"
                    >
                      <option value="BROADCASTED">BROADCASTED</option>
                      <option value="DISPATCHING">DISPATCHING</option>
                      <option value="PENDING">PENDING</option>
                      <option value="RESOLVED">RESOLVED</option>
                    </select>
                  </td>
                  <td className="p-3 text-right">
                    <Button
                      size="sm"
                      variant="telemetry"
                      className="h-7 text-[10px]"
                      onClick={() => setSelectedIncident(inc)}
                    >
                      ENGAGE
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Incident Modal Inspector */}
      {selectedIncident && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-xs border border-slate-800 bg-[#0F172A] p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="h-4 w-4 text-red-400" />
                <span className="font-bold text-white text-xs">INCIDENT COMMAND AUDIT</span>
              </div>
              <button
                onClick={() => setSelectedIncident(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">ID:</span>
                <span className="text-sky-400 font-bold">{selectedIncident.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">PRIORITY:</span>
                <StatusBadge label={selectedIncident.priority} variant="critical" />
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">LOCATION:</span>
                <span className="text-white">{selectedIncident.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">AGENCY:</span>
                <span className="text-slate-300">{selectedIncident.sourceAgency}</span>
              </div>
              <div className="pt-2 border-t border-slate-800 text-slate-300 font-sans text-xs">
                {selectedIncident.description}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedIncident(null)}
              >
                DISMISS
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  resolveAlert(selectedIncident.id);
                  setSelectedIncident(null);
                }}
              >
                MARK AS RESOLVED
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
