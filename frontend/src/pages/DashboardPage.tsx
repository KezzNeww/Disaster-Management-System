import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldAlert,
  Radio,
  Activity,
  AlertTriangle,
  Truck,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';

import { useDisasterContext } from '../context/DisasterContext';
import { useAlertContext } from '../context/AlertContext';
import { useResourceContext } from '../context/ResourceContext';

import { StatCard } from '../components/enterprise/StatCard';
import { ChartCard } from '../components/enterprise/ChartCard';
import { StatusBadge } from '../components/enterprise/StatusBadge';
import { DisasterMap } from '../components/map/DisasterMap';
import { DisasterSidePanel } from '../components/map/DisasterSidePanel';
import { Button } from '../components/ui/button';
import { DashboardAIInsightsSection } from '../ai/components/DashboardAIInsightsSection';

export function DashboardPage() {
  const {
    disasters,
    selectedDisaster,
    selectDisaster,
    currentDisaster,
    kpiOverview,
    dashboardCharts,
  } = useDisasterContext();
  const { alerts, resolveAlert } = useAlertContext();
  const { inventory } = useResourceContext();

  // Dynamic resource allocation vs remaining stock from live inventory context
  const liveResourceUsage = useMemo(() => {
    return inventory.map((item) => ({
      category: item.name.split(' ')[0],
      allocated: item.usage,
      available: item.remaining,
    }));
  }, [inventory]);

  // Dynamic disaster distribution derived from current active disasters
  const liveDisasterDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    disasters.forEach((d) => {
      counts[d.type] = (counts[d.type] || 0) + 1;
    });
    const colors: Record<string, string> = {
      FLOOD: '#38BDF8',
      CYCLONE: '#2563EB',
      EARTHQUAKE: '#F59E0B',
      FIRE: '#EF4444',
    };
    return Object.entries(counts).map(([type, count]) => ({
      name: type,
      count,
      value: Math.round((count / disasters.length) * 100),
      fill: colors[type] || '#94A3B8',
    }));
  }, [disasters]);

  const activeAlertsCount = alerts.filter((a) => a.status !== 'RESOLVED').length;
  const availableResourcesTotal = inventory.reduce((sum, item) => sum + item.remaining, 0);

  return (
    <div className="space-y-6">
      {/* 1. HERO SECTION: Current Disaster Command Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-xs border border-red-500/40 bg-[#0F172A] p-4 sm:p-5 shadow-lg relative overflow-hidden select-none"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left Column: Disaster Name & Region */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-red-500 animate-ping" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-red-400 font-bold">
                PRIMARY ACTIVE DISASTER THREAT
              </span>
              <StatusBadge label={currentDisaster.severity} variant="critical" pulse />
              <StatusBadge label={`STATUS: ${currentDisaster.status}`} variant="high" />
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-white">
                {currentDisaster.name}
              </h1>
              <p className="text-xs font-mono text-slate-400 mt-0.5">
                Target Zone: {currentDisaster.district}, {currentDisaster.state} | Detected: 48h active tracking
              </p>
            </div>
          </div>

          {/* Right Metrics Cluster: Risk Score, Population, Weather */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#111827] p-3 rounded-xs border border-slate-800 font-mono text-xs">
            {/* Risk Score */}
            <div className="border-r border-slate-800 pr-3">
              <div className="text-[10px] text-slate-500 uppercase">RISK SCORE</div>
              <div className="text-xl font-bold text-red-400 mt-0.5">
                {currentDisaster.riskScore}<span className="text-xs text-slate-500">/100</span>
              </div>
              <div className="text-[10px] text-red-400 font-semibold">CRITICAL TIER</div>
            </div>

            {/* Affected Population */}
            <div className="border-r border-slate-800 pr-3">
              <div className="text-[10px] text-slate-500 uppercase">AFFECTED POP.</div>
              <div className="text-xl font-bold text-white mt-0.5">
                {(currentDisaster.affectedPopulation / 1000000).toFixed(2)}M
              </div>
              <div className="text-[10px] text-slate-400">124 Shelters Open</div>
            </div>

            {/* Live Weather */}
            <div className="border-r border-slate-800 pr-3">
              <div className="text-[10px] text-slate-500 uppercase">WIND / GUSTS</div>
              <div className="text-xl font-bold text-sky-400 mt-0.5">
                {currentDisaster.weather.windSpeedKmh} <span className="text-xs">km/h</span>
              </div>
              <div className="text-[10px] text-slate-400">{currentDisaster.weather.condition}</div>
            </div>

            {/* Precipitation */}
            <div>
              <div className="text-[10px] text-slate-500 uppercase">RAIN INTENSITY</div>
              <div className="text-xl font-bold text-blue-400 mt-0.5">
                {currentDisaster.weather.precipitationMmH} <span className="text-xs">mm/h</span>
              </div>
              <div className="text-[10px] text-slate-400">{currentDisaster.weather.temperatureC}°C Ambient</div>
            </div>
          </div>
        </div>

        {/* Hero Bottom Telemetry Line */}
        <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-2">
              <Radio className="h-3.5 w-3.5 text-sky-400 animate-pulse" />
              <span>RADAR VECTOR: 42km offshore tracking North-Northwest at 18 km/h</span>
            </div>
            <span className="text-slate-700 hidden sm:inline">|</span>
            <span className="text-[10px] text-slate-500 hidden sm:inline">DOPPLER DWR-04 • UPLINK: 14ms NOMINAL</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded-xs hidden md:inline-flex items-center space-x-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>LIVE TELEMETRY STREAM</span>
            </span>
            <Button
              size="sm"
              variant="telemetry"
              onClick={() => selectDisaster(currentDisaster)}
            >
              INSPECT LIVE INCIDENT TELEMETRY
            </Button>
          </div>
        </div>
      </motion.div>

      {/* 2. AI DECISION SUPPORT SYSTEM INTELLIGENCE */}
      <DashboardAIInsightsSection />

      {/* 3. FOUR KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="HIGH RISK AREAS"
          value={kpiOverview.highRiskAreasCount}
          suffix="Districts"
          trendText={kpiOverview.deltaTrends.highRisk}
          trendType="critical"
          icon={ShieldAlert}
          iconColor="#EF4444"
          delayIndex={0}
        />
        <StatCard
          title="EMERGENCY TEAMS"
          value={kpiOverview.emergencyTeamsCount}
          suffix="Squads Active"
          trendText={kpiOverview.deltaTrends.teams}
          trendType="positive"
          icon={Activity}
          iconColor="#22C55E"
          delayIndex={1}
        />
        <StatCard
          title="AVAILABLE RESOURCES"
          value={availableResourcesTotal}
          suffix="Units Staged"
          trendText={kpiOverview.deltaTrends.resources}
          trendType="neutral"
          icon={Truck}
          iconColor="#38BDF8"
          delayIndex={2}
        />
        <StatCard
          title="ACTIVE ALERTS"
          value={activeAlertsCount}
          suffix="Priority Feeds"
          trendText={kpiOverview.deltaTrends.alerts}
          trendType="critical"
          icon={AlertTriangle}
          iconColor="#F59E0B"
          delayIndex={3}
        />
      </div>

      {/* 3. INTERACTIVE DISASTER MAP */}
      <div className="rounded-xs border border-slate-800 bg-[#0F172A] shadow-md overflow-hidden relative">
        <div className="p-3.5 bg-[#111827] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-blue-500 animate-ping" />
            <span className="font-bold text-white uppercase tracking-wider">
              REAL-TIME GEOSPATIAL MULTI-HAZARD MAP
            </span>
            <span className="text-slate-500 hidden sm:inline">|</span>
            <span className="text-slate-400 text-[11px] hidden sm:inline">
              React Leaflet • {disasters.length} Active Telemetry Nodes • Hover for tooltip • Click to open panel
            </span>
          </div>

          <div className="flex items-center space-x-2 text-[11px]">
            <span className="text-slate-400">MARKERS:</span>
            <span className="text-sky-400">🌊 Flood</span>
            <span className="text-amber-400">⚡ Quake</span>
            <span className="text-blue-400">🌀 Cyclone</span>
            <span className="text-red-400">🔥 Fire</span>
          </div>
        </div>

        {/* Map Container */}
        <div className="h-[460px] w-full relative">
          <DisasterMap
            disasters={disasters}
            selectedDisaster={selectedDisaster}
            onSelectDisaster={(d) => selectDisaster(d)}
            center={[21.5, 82.5]}
            zoom={5}
          />

          {/* Sliding Tactical Detail Panel */}
          <DisasterSidePanel
            disaster={selectedDisaster}
            onClose={() => selectDisaster(null)}
          />
        </div>
      </div>

      {/* 4. CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart: Risk Trend */}
        <ChartCard
          title="COMPOSITE RISK TREND (PAST 24 HOURS)"
          subtitle="Hourly multi-sensor threat score trajectory vs critical threshold"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dashboardCharts.riskTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="time" stroke="#64748B" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
              <YAxis domain={[40, 100]} stroke="#64748B" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
              <RechartsTooltip
                contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: 4, fontSize: 11, fontFamily: 'monospace' }}
              />
              <Line type="monotone" dataKey="compositeIndex" name="Composite Risk" stroke="#EF4444" strokeWidth={2.5} dot={{ r: 3, fill: '#EF4444' }} />
              <Line type="monotone" dataKey="cycloneRisk" name="Cyclone Telemetry" stroke="#38BDF8" strokeWidth={1.5} dot={false} strokeDasharray="4 4" />
              <Line type="monotone" dataKey="threshold" name="Critical Threshold (75)" stroke="#64748B" strokeWidth={1} strokeDasharray="2 2" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Bar Chart: Resource Usage */}
        <ChartCard
          title="TACTICAL RESOURCE ALLOCATION VS REMAINING STOCK"
          subtitle="Key life-support supply utilization across active response sectors"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={liveResourceUsage} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="category" stroke="#64748B" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
              <YAxis stroke="#64748B" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
              <RechartsTooltip
                contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: 4, fontSize: 11, fontFamily: 'monospace' }}
              />
              <Bar dataKey="allocated" name="Allocated Units" fill="#2563EB" radius={[2, 2, 0, 0]} />
              <Bar dataKey="available" name="Available Reserve" fill="#22C55E" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Pie Chart: Disaster Distribution */}
        <ChartCard
          title="ACTIVE DISASTER CLASSIFICATION BREAKDOWN"
          subtitle="Proportion of registered emergency incidents by physical phenomenon"
        >
          <div className="h-full flex items-center justify-between">
            <ResponsiveContainer width="55%" height="100%">
              <PieChart>
                <Pie
                  data={liveDisasterDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {liveDisasterDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} stroke="#0F172A" strokeWidth={2} />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: 4, fontSize: 11, fontFamily: 'monospace' }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Custom Right Legend */}
            <div className="w-[45%] font-mono text-xs space-y-2 pr-2">
              {liveDisasterDistribution.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                    <span className="text-slate-300 text-[11px]">{item.name}</span>
                  </div>
                  <span className="font-bold text-white text-[11px]">
                    {item.value}% ({item.count})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        {/* Area Chart: Response Time */}
        <ChartCard
          title="AVERAGE EMERGENCY RESPONSE TIME (PAST 7 DAYS)"
          subtitle="Minutes from initial sensor alert confirmation to first-responder arrival"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dashboardCharts.responseTime} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="areaResponseColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="day" stroke="#64748B" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
              <YAxis stroke="#64748B" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
              <RechartsTooltip
                contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: 4, fontSize: 11, fontFamily: 'monospace' }}
              />
              <Area type="monotone" dataKey="avgTimeMinutes" name="Average Latency (Mins)" stroke="#38BDF8" strokeWidth={2} fillOpacity={1} fill="url(#areaResponseColor)" />
              <Line type="monotone" dataKey="targetMinutes" name="SLA Target (20m)" stroke="#22C55E" strokeWidth={1.5} strokeDasharray="3 3" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* 5. RECENT ALERTS TABLE */}
      <div className="rounded-xs border border-slate-800 bg-[#0F172A] shadow-md overflow-hidden">
        <div className="p-3.5 bg-[#111827] border-b border-slate-800 flex items-center justify-between font-mono text-xs">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <span className="font-bold text-white uppercase tracking-wider">
              REAL-TIME DISPATCH ALERTS LOG
            </span>
          </div>
          <span className="text-slate-400 text-[11px]">
            {alerts.length} Recorded Incidents • Automated IMD & CWC Feed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#111827]/70 text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="p-3">PRIORITY</th>
                <th className="p-3">TYPE</th>
                <th className="p-3">INCIDENT SUMMARY</th>
                <th className="p-3">LOCATION</th>
                <th className="p-3">TIMESTAMP</th>
                <th className="p-3">DISPATCH STATUS</th>
                <th className="p-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {alerts.slice(0, 10).map((alert) => {
                const isCritical = alert.priority === 'CRITICAL';
                return (
                  <tr
                    key={alert.id}
                    className="hover:bg-slate-800/40 transition-colors select-none"
                  >
                    <td className="p-3">
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
                    </td>
                    <td className="p-3 font-semibold text-sky-400">{alert.type}</td>
                    <td className="p-3 font-sans text-slate-200 max-w-sm">
                      <div className="font-medium truncate">{alert.description}</div>
                      <div className="text-[10px] text-slate-500 font-mono">ID: {alert.id} • {alert.sourceAgency}</div>
                    </td>
                    <td className="p-3 text-slate-300">{alert.location}</td>
                    <td className="p-3 text-slate-400 text-[11px]">{alert.timestamp}</td>
                    <td className="p-3">
                      <span className="text-[10px] px-2 py-0.5 rounded-xs bg-slate-800 border border-slate-700 text-slate-200 font-mono">
                        {alert.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        {alert.status !== 'RESOLVED' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-[10px] text-emerald-400 hover:text-emerald-300 border-emerald-900/60"
                            onClick={() => resolveAlert(alert.id)}
                          >
                            RESOLVE
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="telemetry"
                          className="h-7 text-[10px]"
                          onClick={() => {
                            const match = disasters.find((d) => d.type === alert.type) || disasters[0];
                            selectDisaster(match);
                          }}
                        >
                          ENGAGE
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
