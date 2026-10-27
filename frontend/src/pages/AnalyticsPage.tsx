import React, { useState, useMemo } from 'react';
import {
  Download,
  Activity,
  Users,
  Clock,
  ShieldCheck,
  Bot,
  HeartPulse,
  Building2,
  Navigation,
  Zap,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

import { mockAnalyticsData } from '../mock/mockAnalytics';
import { useAI } from '../ai';
import { SectionHeader } from '../components/enterprise/SectionHeader';
import { ChartCard } from '../components/enterprise/ChartCard';
import { StatCard } from '../components/enterprise/StatCard';
import { Button } from '../components/ui/button';

export function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'12M' | '6M' | '30D'>('12M');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const { worldState, threatScore, confidence } = useAI({ autoFetch: false });

  // Step 7: Blackboard-derived AI Readiness & Resilience scores
  const aiAnalytics = useMemo(() => {
    // 1. Operational Readiness Score
    const opReadiness = Math.round(Math.max(15, Math.min(100, 100 - (threatScore * 0.42) + (confidence * 0.1))));

    // 2. Resource Sufficiency Score
    const res = worldState.resources;
    const foodRatio = res?.foodRationsKits ? Math.min(1, res.foodRationsKits.available / Math.max(1, res.foodRationsKits.required)) : 0.85;
    const waterRatio = res?.potableWaterLiters ? Math.min(1, res.potableWaterLiters.available / Math.max(1, res.potableWaterLiters.required)) : 0.8;
    const medRatio = res?.emergencyMedicalKits ? Math.min(1, res.emergencyMedicalKits.available / Math.max(1, res.emergencyMedicalKits.required)) : 0.9;
    const resSufficiency = Math.round(((foodRatio + waterRatio + medRatio) / 3) * 100);

    // 3. Infrastructure Health Score
    const infra = worldState.infrastructure;
    const infraHealth = Math.round(Math.max(20, 100 - (infra.structuralDamagePercentage || 0) - (infra.bridgesCollapsed || 0) * 12 - (infra.cellularTowersOffline || 0) * 4));

    // 4. Medical Readiness
    const hosp = worldState.hospitals;
    const icuBase = hosp.operatingAtFullCapacity ? 45 : 82;
    const genBonus = hosp.backupGeneratorsOperational ? 10 : -20;
    const medReadiness = Math.round(Math.max(15, Math.min(100, icuBase + genBonus + (hosp.icuBedsAvailable > 10 ? 8 : 0))));

    // 5. Evacuation Readiness
    const pop = worldState.population;
    const evacRate = (pop.evacuationComplianceRate || 0.82) * 100;
    const strandedPenalty = pop.strandedCount > 500 ? 12 : 0;
    const evacReadiness = Math.round(Math.max(20, evacRate - strandedPenalty));

    return {
      operationalReadiness: opReadiness,
      resourceSufficiency: resSufficiency,
      infrastructureHealth: infraHealth,
      medicalReadiness: medReadiness,
      evacuationReadiness: evacReadiness,
    };
  }, [worldState, threatScore, confidence]);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      const csvContent = "data:text/csv;charset=utf-8,Month,TotalEvents,Floods,Cyclones,Earthquakes,Fires,PopulationAffectedK\n" +
        mockAnalyticsData.monthlyTrends.map((e) => `${e.month},${e.totalEvents},${e.floods},${e.cyclones},${e.earthquakes},${e.fires},${e.populationAffectedK}`).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `Executive_SITREP_Analytics_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 500);
  };

  return (
    <div className="space-y-6 font-mono text-xs select-none">
      {/* Page Header */}
      <SectionHeader
        title="EXECUTIVE TELEMETRY & STRATEGIC DISASTER ANALYTICS"
        badgeText="SITREP RETROSPECTIVE"
        badgeVariant="telemetry"
        description="Multi-year disaster trends, logistical throughput benchmarks, evacuation latency evaluations, and infrastructure resilience scores."
        actions={
          <div className="flex items-center space-x-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as '12M' | '6M' | '30D')}
              className="h-8 rounded-xs border border-slate-800 bg-[#111827] px-2.5 text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
            >
              <option value="12M">ROLLING 12 MONTHS</option>
              <option value="6M">PAST 6 MONTHS</option>
              <option value="30D">PAST 30 DAYS</option>
            </select>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={isExporting}
              className="space-x-1.5"
            >
              <Download className="h-3.5 w-3.5 text-sky-400" />
              <span>{isExporting ? 'COMPILING SITREP...' : 'EXPORT REPORT'}</span>
            </Button>
          </div>
        }
      />

      {/* 1. EXECUTIVE KPI SUMMARY ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="TOTAL INCIDENTS YTD"
          value={mockAnalyticsData.executiveKPIs.totalIncidentsRecordedYTD}
          suffix="Events"
          trendText="+14.2% vs Prior Year"
          trendType="negative"
          icon={Activity}
          iconColor="#38BDF8"
          delayIndex={0}
        />
        <StatCard
          title="LIVES SECURED EST."
          value={4800000}
          suffix="Citizens"
          trendText="91.4% Evac. Rate"
          trendType="positive"
          icon={Users}
          iconColor="#22C55E"
          delayIndex={1}
        />
        <StatCard
          title="MEDIAN DISPATCH LATENCY"
          value={16}
          suffix="Minutes"
          trendText="-3.8m faster than target"
          trendType="positive"
          icon={Clock}
          iconColor="#2563EB"
          delayIndex={2}
        />
        <StatCard
          title="RESILIENCE SCORE"
          value={85}
          suffix="/100"
          trendText="ISO-22301 Compliant"
          trendType="neutral"
          icon={ShieldCheck}
          iconColor="#F59E0B"
          delayIndex={3}
        />
      </div>

      {/* AI STRATEGIC READINESS & OPERATIONAL HEALTH MATRIX (STEP 7: BLACKBOARD DERIVED) */}
      <div className="rounded-sm border border-slate-800 bg-[#0B132B]/70 p-4 backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3 mb-4">
          <div className="flex items-center space-x-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-xs bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Bot className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
                AI Strategic Readiness & Operational Health Matrix
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-xs bg-sky-500/10 text-sky-400 border border-sky-500/30">
                  REAL-TIME BLACKBOARD INFERENCE
                </span>
              </div>
              <div className="text-[10px] text-slate-400">
                Derived directly from live crisis telemetry, resource burn rates, and infrastructure sensors
              </div>
            </div>
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            EVALUATION CYCLE: <span className="text-emerald-400 font-bold">CONTINUOUS</span> | CONFIDENCE: <span className="text-sky-300 font-bold">{Math.round(confidence * 100)}%</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* 1. Operational Readiness */}
          <div className="p-3 rounded-xs border border-slate-800/90 bg-[#111827]/80">
            <div className="flex items-center justify-between text-slate-400 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider">Operational Readiness</span>
              <Zap className="h-3.5 w-3.5 text-amber-400" />
            </div>
            <div className="flex items-baseline space-x-1.5 mb-2">
              <span className={`text-xl font-bold font-mono ${aiAnalytics.operationalReadiness >= 75 ? 'text-emerald-400' : aiAnalytics.operationalReadiness >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                {aiAnalytics.operationalReadiness}%
              </span>
              <span className="text-[10px] text-slate-400 font-mono">/ 100</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-1.5 rounded-full transition-all duration-500 ${aiAnalytics.operationalReadiness >= 75 ? 'bg-emerald-500' : aiAnalytics.operationalReadiness >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                style={{ width: `${aiAnalytics.operationalReadiness}%` }}
              />
            </div>
            <div className="mt-2 text-[10px] text-slate-400 truncate">
              Threat load vs command capacity
            </div>
          </div>

          {/* 2. Resource Sufficiency */}
          <div className="p-3 rounded-xs border border-slate-800/90 bg-[#111827]/80">
            <div className="flex items-center justify-between text-slate-400 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider">Resource Sufficiency</span>
              <Activity className="h-3.5 w-3.5 text-sky-400" />
            </div>
            <div className="flex items-baseline space-x-1.5 mb-2">
              <span className={`text-xl font-bold font-mono ${aiAnalytics.resourceSufficiency >= 75 ? 'text-emerald-400' : aiAnalytics.resourceSufficiency >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                {aiAnalytics.resourceSufficiency}%
              </span>
              <span className="text-[10px] text-slate-400 font-mono">/ 100</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-1.5 rounded-full transition-all duration-500 ${aiAnalytics.resourceSufficiency >= 75 ? 'bg-emerald-500' : aiAnalytics.resourceSufficiency >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                style={{ width: `${aiAnalytics.resourceSufficiency}%` }}
              />
            </div>
            <div className="mt-2 text-[10px] text-slate-400 truncate">
              Food, water & medical stock ratio
            </div>
          </div>

          {/* 3. Infrastructure Health */}
          <div className="p-3 rounded-xs border border-slate-800/90 bg-[#111827]/80">
            <div className="flex items-center justify-between text-slate-400 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider">Infrastructure Health</span>
              <Building2 className="h-3.5 w-3.5 text-indigo-400" />
            </div>
            <div className="flex items-baseline space-x-1.5 mb-2">
              <span className={`text-xl font-bold font-mono ${aiAnalytics.infrastructureHealth >= 70 ? 'text-emerald-400' : aiAnalytics.infrastructureHealth >= 45 ? 'text-amber-400' : 'text-rose-400'}`}>
                {aiAnalytics.infrastructureHealth}%
              </span>
              <span className="text-[10px] text-slate-400 font-mono">/ 100</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-1.5 rounded-full transition-all duration-500 ${aiAnalytics.infrastructureHealth >= 70 ? 'bg-emerald-500' : aiAnalytics.infrastructureHealth >= 45 ? 'bg-amber-500' : 'bg-rose-500'}`}
                style={{ width: `${aiAnalytics.infrastructureHealth}%` }}
              />
            </div>
            <div className="mt-2 text-[10px] text-slate-400 truncate">
              Bridges, grid & telecom stability
            </div>
          </div>

          {/* 4. Medical Readiness */}
          <div className="p-3 rounded-xs border border-slate-800/90 bg-[#111827]/80">
            <div className="flex items-center justify-between text-slate-400 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider">Medical Readiness</span>
              <HeartPulse className="h-3.5 w-3.5 text-rose-400" />
            </div>
            <div className="flex items-baseline space-x-1.5 mb-2">
              <span className={`text-xl font-bold font-mono ${aiAnalytics.medicalReadiness >= 75 ? 'text-emerald-400' : aiAnalytics.medicalReadiness >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                {aiAnalytics.medicalReadiness}%
              </span>
              <span className="text-[10px] text-slate-400 font-mono">/ 100</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-1.5 rounded-full transition-all duration-500 ${aiAnalytics.medicalReadiness >= 75 ? 'bg-emerald-500' : aiAnalytics.medicalReadiness >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                style={{ width: `${aiAnalytics.medicalReadiness}%` }}
              />
            </div>
            <div className="mt-2 text-[10px] text-slate-400 truncate">
              ICU headroom & power reliability
            </div>
          </div>

          {/* 5. Evacuation Readiness */}
          <div className="p-3 rounded-xs border border-slate-800/90 bg-[#111827]/80">
            <div className="flex items-center justify-between text-slate-400 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider">Evacuation Readiness</span>
              <Navigation className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <div className="flex items-baseline space-x-1.5 mb-2">
              <span className={`text-xl font-bold font-mono ${aiAnalytics.evacuationReadiness >= 75 ? 'text-emerald-400' : aiAnalytics.evacuationReadiness >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                {aiAnalytics.evacuationReadiness}%
              </span>
              <span className="text-[10px] text-slate-400 font-mono">/ 100</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-1.5 rounded-full transition-all duration-500 ${aiAnalytics.evacuationReadiness >= 75 ? 'bg-emerald-500' : aiAnalytics.evacuationReadiness >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                style={{ width: `${aiAnalytics.evacuationReadiness}%` }}
              />
            </div>
            <div className="mt-2 text-[10px] text-slate-400 truncate">
              Corridor safety & egress rate
            </div>
          </div>
        </div>
      </div>

      {/* 2. CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Monthly Disasters Breakdown (Stacked Bar Chart) */}
        <ChartCard
          title="MONTHLY DISASTER INCIDENTS (12-MONTH HISTORICAL)"
          subtitle="Cumulative event distribution by hazard classification"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={mockAnalyticsData.monthlyTrends}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="month" stroke="#64748B" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
              <YAxis stroke="#64748B" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#334155',
                  borderRadius: 4,
                  fontSize: 11,
                  fontFamily: 'monospace',
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: 11, fontFamily: 'monospace', paddingTop: 8 }}
              />
              <Bar dataKey="floods" name="Floods" stackId="a" fill="#38BDF8" />
              <Bar dataKey="cyclones" name="Cyclones" stackId="a" fill="#2563EB" />
              <Bar dataKey="earthquakes" name="Quakes" stackId="a" fill="#F59E0B" />
              <Bar dataKey="fires" name="Fires" stackId="a" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Chart 2: Population Affected Curve (Area Chart) */}
        <ChartCard
          title="CUMULATIVE POPULATION IMPACT DYNAMICS (THOUSANDS)"
          subtitle="Estimated citizens displaced or requiring acute relief logistics"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={mockAnalyticsData.monthlyTrends}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="popAffectedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="month" stroke="#64748B" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
              <YAxis stroke="#64748B" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#334155',
                  borderRadius: 4,
                  fontSize: 11,
                  fontFamily: 'monospace',
                }}
              />
              <Area
                type="monotone"
                dataKey="populationAffectedK"
                name="Population Impacted (000s)"
                stroke="#38BDF8"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#popAffectedGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Chart 3: Average Response Time by District (Bar Chart) */}
        <ChartCard
          title="FIRST-RESPONDER DISPATCH LATENCY BY DISTRICT"
          subtitle="Mean duration in minutes from sensor ingest to boots on the ground"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={mockAnalyticsData.districtPerformance}
              layout="vertical"
              margin={{ top: 10, right: 20, left: 20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" horizontal={false} />
              <XAxis type="number" stroke="#64748B" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
              <YAxis
                type="category"
                dataKey="district"
                stroke="#64748B"
                tick={{ fontSize: 10, fontFamily: 'monospace' }}
                width={95}
              />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#334155',
                  borderRadius: 4,
                  fontSize: 11,
                  fontFamily: 'monospace',
                }}
              />
              <Bar dataKey="responseMinutes" name="Response Latency (Mins)" fill="#38BDF8" radius={[0, 2, 2, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Chart 4: Severity Breakdown (Donut Chart) */}
        <ChartCard
          title="SEVERITY PROPORTION & RESOURCE CONSUMPTION PROFILE"
          subtitle="Distribution of emergencies categorized under DEFCON response criteria"
        >
          <div className="h-full flex items-center justify-between">
            <ResponsiveContainer width="55%" height="100%">
              <PieChart>
                <Pie
                  data={mockAnalyticsData.severityBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="percentage"
                >
                  {mockAnalyticsData.severityBreakdown.map((entry, index) => (
                    <Cell key={`sev-cell-${index}`} fill={entry.fill} stroke="#0F172A" strokeWidth={2} />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: 4,
                    fontSize: 11,
                    fontFamily: 'monospace',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Custom Legend */}
            <div className="w-[45%] font-mono text-xs space-y-2 pr-2">
              {mockAnalyticsData.severityBreakdown.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                    <span className="text-slate-300 text-[11px] truncate max-w-[100px]">{item.name}</span>
                  </div>
                  <span className="font-bold text-white text-[11px]">
                    {item.percentage}% ({item.count})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
