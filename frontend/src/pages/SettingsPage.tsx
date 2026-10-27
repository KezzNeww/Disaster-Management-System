import React, { useState } from 'react';
import {
  Radio,
  Sliders,
  Key,
  Save,
} from 'lucide-react';
import { SectionHeader } from '../components/enterprise/SectionHeader';
import { Button } from '../components/ui/button';

export function SettingsPage() {
  const [telemetryInterval, setTelemetryInterval] = useState('2s');
  const [defconLevel, setDefconLevel] = useState('3');
  const [simulationSampleSize, setSimulationSampleSize] = useState('10000');
  const [autoBroadcast, setAutoBroadcast] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6 font-mono text-xs select-none max-w-5xl">
      <SectionHeader
        title="COMMAND CONSOLE CONFIGURATION & DEFCON THRESHOLDS"
        badgeText="SYS-ADMIN LVL 4"
        badgeVariant="telemetry"
        description="Global system parameters, telemetry ingest intervals, neural propagation confidence thresholds, and broadcast channel authorization."
        actions={
          <Button variant="default" size="sm" onClick={handleSave} className="space-x-1.5">
            <Save className="h-3.5 w-3.5" />
            <span>{savedSuccess ? 'CONFIG COMMITTED!' : 'COMMIT SETTINGS'}</span>
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: System Telemetry & Cluster Node */}
        <div className="p-4 rounded-xs border border-slate-800 bg-[#0F172A] space-y-4 shadow-sm">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
            <Radio className="h-4 w-4 text-sky-400" />
            <h3 className="font-bold text-white text-xs uppercase">
              TELEMETRY INGESTION ENGINE
            </h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-slate-400 block mb-1">REALTIME SENSOR POLLING FREQUENCY</label>
              <select
                value={telemetryInterval}
                onChange={(e) => setTelemetryInterval(e.target.value)}
                className="w-full h-8 rounded-xs border border-slate-800 bg-[#111827] px-2.5 text-xs text-slate-200 focus:outline-none"
              >
                <option value="1s">1000ms (High Density / Peak Defcon)</option>
                <option value="2s">2000ms (Default Tactical Stream)</option>
                <option value="5s">5000ms (Standard Monitoring)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">DEFAULT DEFCON READINESS TIER</label>
              <select
                value={defconLevel}
                onChange={(e) => setDefconLevel(e.target.value)}
                className="w-full h-8 rounded-xs border border-slate-800 bg-[#111827] px-2.5 text-xs text-slate-200 focus:outline-none"
              >
                <option value="1">DEFCON 1: MAXIMUM ALERT (FULL MOBILIZATION)</option>
                <option value="2">DEFCON 2: FAST RESPONSE CONTINGENCY</option>
                <option value="3">DEFCON 3: ELEVATED RISK WATCH</option>
                <option value="4">DEFCON 4: ROUTINE SITUATIONAL AWARENESS</option>
              </select>
            </div>

            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between">
              <span>ACTIVE CLUSTER:</span>
              <span className="text-emerald-400 font-bold">AZURE ASIA-SOUTH-1 (SECURE ENCLAVE)</span>
            </div>
          </div>
        </div>

        {/* Card 2: AI Neural Propagation Parameters */}
        <div className="p-4 rounded-xs border border-slate-800 bg-[#0F172A] space-y-4 shadow-sm">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
            <Sliders className="h-4 w-4 text-blue-400" />
            <h3 className="font-bold text-white text-xs uppercase">
              AI MODEL INFERENCE BENCHMARKS
            </h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-slate-400 block mb-1">MONTE CARLO SAMPLE SIZE (ITERATIONS)</label>
              <select
                value={simulationSampleSize}
                onChange={(e) => setSimulationSampleSize(e.target.value)}
                className="w-full h-8 rounded-xs border border-slate-800 bg-[#111827] px-2.5 text-xs text-slate-200 focus:outline-none"
              >
                <option value="5000">N = 5,000 (Fast Approximation)</option>
                <option value="10000">N = 10,000 (Standard High Fidelity)</option>
                <option value="25000">N = 25,000 (Maximum Rigor / Cloud HPC)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">AUTONOMOUS CAP WARNING TRIGGER</label>
              <div className="flex items-center justify-between p-2 rounded-xs bg-[#111827] border border-slate-800">
                <span className="text-slate-300">Auto-queue alerts when Risk &gt; 85</span>
                <input
                  type="checkbox"
                  checked={autoBroadcast}
                  onChange={(e) => setAutoBroadcast(e.target.checked)}
                  className="h-4 w-4 rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between">
              <span>WEIGHT REVISION:</span>
              <span className="text-sky-400 font-bold">Aegis-GeoEnsemble-v4.8-FP16</span>
            </div>
          </div>
        </div>

        {/* Card 3: Security & Clearance Credentials */}
        <div className="p-4 rounded-xs border border-slate-800 bg-[#0F172A] space-y-4 shadow-sm md:col-span-2">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
            <Key className="h-4 w-4 text-amber-400" />
            <h3 className="font-bold text-white text-xs uppercase">
              ACTIVE SATELLITE API KEYS & SECURITY TOKENS
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
            <div className="p-2.5 rounded-xs bg-[#111827] border border-slate-800 space-y-1">
              <span className="text-slate-500 uppercase">ISRO BHUVAN TELEMETRY</span>
              <div className="text-emerald-400 font-bold">TOKEN: ACTIVE (SEC-HIGH)</div>
              <div className="text-[10px] text-slate-500">Expires: in 248 days</div>
            </div>

            <div className="p-2.5 rounded-xs bg-[#111827] border border-slate-800 space-y-1">
              <span className="text-slate-500 uppercase">IMD AWS RADAR GRID</span>
              <div className="text-emerald-400 font-bold">UPLINK: SYNCHRONIZED</div>
              <div className="text-[10px] text-slate-500">Throughput: 480 KB/s</div>
            </div>

            <div className="p-2.5 rounded-xs bg-[#111827] border border-slate-800 space-y-1">
              <span className="text-slate-500 uppercase">CWC HYDROLOGIC GAUGES</span>
              <div className="text-emerald-400 font-bold">TOKEN: ENCRYPTED AES-256</div>
              <div className="text-[10px] text-slate-500">1,248 Nodes Online</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
