import React from 'react';
import { motion } from 'framer-motion';
import {
  BrainCircuit,
  Sparkles,
  Zap,
  TrendingUp,
  Sliders,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

import { usePredictionContext } from '../context/PredictionContext';
import { useDisasterContext } from '../context/DisasterContext';
import { DisasterItem } from '../types';
import { SectionHeader } from '../components/enterprise/SectionHeader';
import { ProgressRing } from '../components/enterprise/ProgressRing';
import { StatusBadge } from '../components/enterprise/StatusBadge';
import { Button } from '../components/ui/button';

export function AIPredictionPage() {
  const {
    prediction,
    selectedDisasterId,
    setSelectedDisasterId,
    runPredictionForDisaster,
    authorizeAction,
    authorizedRecommendations,
  } = usePredictionContext();
  const { disasters } = useDisasterContext();

  const handleDisasterChange = (id: string) => {
    setSelectedDisasterId(id);
    const target = disasters.find((d) => d.id === id);
    if (target) runPredictionForDisaster(target);
  };

  const handleReRun = () => {
    const target = disasters.find((d) => d.id === selectedDisasterId) || disasters[0];
    runPredictionForDisaster(target);
  };

  return (
    <div className="space-y-6 font-mono text-xs select-none">
      {/* Page Header */}
      <SectionHeader
        title="NEURAL GEOSPATIAL HAZARD PROPAGATION ENGINE"
        badgeText="AEGIS DEEP ENSEMBLE v4.8"
        badgeVariant="telemetry"
        description="High-fidelity predictive modeling combining transformer hydrologic networks, seismic rupture simulations, and spatial cellular automata."
        actions={
          <div className="flex items-center space-x-2">
            <select
              value={selectedDisasterId}
              onChange={(e) => handleDisasterChange(e.target.value)}
              className="h-8 rounded-xs border border-slate-800 bg-[#111827] px-2.5 text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
            >
              {disasters.slice(0, 8).map((d: DisasterItem) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.type})
                </option>
              ))}
            </select>
            <Button variant="default" size="sm" className="space-x-1" onClick={handleReRun}>
              <Sparkles className="h-3.5 w-3.5" />
              <span>RE-RUN INFERENCE</span>
            </Button>
          </div>
        }
      />

      {/* 1. TOP TELEMETRY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gauge 1: Large Risk Score Gauge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="rounded-xs border border-slate-800 bg-[#0F172A] p-5 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden"
        >
          <div className="w-full flex items-center justify-between border-b border-slate-800 pb-2 mb-4">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
              PROJECTED RISK SCORE
            </span>
            <StatusBadge label="CRITICAL THREAT" variant="critical" pulse />
          </div>

          <div className="my-2">
            <ProgressRing
              progress={prediction.calculatedRiskScore}
              size={140}
              strokeWidth={10}
              strokeColor="#EF4444"
              trailColor="#1E293B"
              unit="/100"
              label="SEVERITY INDEX"
            />
          </div>

          <p className="text-[11px] text-slate-400 mt-2 font-mono">
            Peak Impact Horizon: <strong className="text-white">+4.2 Hours</strong>
          </p>
          <div className="text-[10px] text-red-400 font-semibold mt-0.5">
            Surpasses Critical Intervention SLA (75.0)
          </div>
        </motion.div>

        {/* Gauge 2: Confidence Meter */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="rounded-xs border border-slate-800 bg-[#0F172A] p-5 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden"
        >
          <div className="w-full flex items-center justify-between border-b border-slate-800 pb-2 mb-4">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
              MODEL CONFIDENCE METER
            </span>
            <StatusBadge label="HIGH FIDELITY" variant="telemetry" />
          </div>

          <div className="my-2">
            <ProgressRing
              progress={prediction.confidenceScore}
              size={140}
              strokeWidth={10}
              strokeColor="#38BDF8"
              trailColor="#1E293B"
              unit="%"
              label="CONFIDENCE"
            />
          </div>

          <p className="text-[11px] text-slate-400 mt-2 font-mono">
            Monte Carlo Iterations: <strong className="text-white">N = 10,000</strong>
          </p>
          <div className="text-[10px] text-sky-400 font-semibold mt-0.5">
            Validation Loss: 0.018 (FP16 Quantized)
          </div>
        </motion.div>

        {/* Reasoning Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.16 }}
          className="rounded-xs border border-slate-800 bg-[#0F172A] p-5 shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-2 mb-3">
              <BrainCircuit className="h-4 w-4 text-sky-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                EXPLAINABLE AI CAUSAL REASONING
              </span>
            </div>

            <p className="text-xs font-sans text-slate-200 leading-relaxed mb-3">
              {prediction.reasoningSummary}
            </p>

            <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
              <span className="text-[10px] text-slate-500 uppercase font-bold">
                PRIMARY HAZARD DRIVERS:
              </span>
              {prediction.primaryHazardDrivers.map((driver, idx) => (
                <div key={idx} className="flex items-start space-x-1.5 text-[11px] text-slate-300">
                  <span className="text-red-400 font-bold">›</span>
                  <span>{driver}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between">
            <span>Neural Architecture: Transformer-SpatioTemporal</span>
            <span className="text-emerald-400 font-bold">VERIFIED</span>
          </div>
        </motion.div>
      </div>

      {/* 2. FEATURE IMPORTANCE */}
      <div className="rounded-xs border border-slate-800 bg-[#0F172A] p-5 shadow-md">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div>
            <h3 className="text-xs font-bold font-mono uppercase text-white tracking-wider flex items-center space-x-2">
              <Sliders className="h-4 w-4 text-sky-400" />
              <span>FEATURE IMPORTANCE DECOMPOSITION (SHAP VALUE WEIGHTS)</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Relative contribution of environmental and telemetry parameters to total risk score
            </p>
          </div>
          <span className="text-[10px] text-slate-500 hidden sm:inline">
            NORMALIZED SUM = 1.00
          </span>
        </div>

        <div className="space-y-3.5">
          {prediction.features.map((feat, idx) => {
            const isMitigating = feat.impactType === 'MITIGATING';
            const percentWidth = Math.round(feat.weight * 100);

            return (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-200">{feat.featureName}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-xs border uppercase font-mono ${
                        isMitigating
                          ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40'
                          : 'bg-red-950/60 text-red-400 border-red-500/40'
                      }`}
                    >
                      {isMitigating ? 'MITIGATING (-)' : 'HAZARD AMPLIFIER (+)'}
                    </span>
                  </div>
                  <span className="font-mono text-slate-300 font-bold">
                    {(feat.weight * 100).toFixed(0)}% contribution
                  </span>
                </div>

                <div className="h-2 w-full rounded-xs bg-[#111827] overflow-hidden border border-slate-800">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentWidth * 2.5}%` }}
                    transition={{ duration: 0.6, delay: 0.1 + idx * 0.05 }}
                    className={`h-full ${isMitigating ? 'bg-emerald-500' : 'bg-blue-600'}`}
                  />
                </div>

                <p className="text-[10px] text-slate-400 font-sans">{feat.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. PREDICTION TIMELINE */}
      <div className="rounded-xs border border-slate-800 bg-[#0F172A] p-5 shadow-md">
        <div className="border-b border-slate-800 pb-3 mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold font-mono uppercase text-white tracking-wider flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <span>TEMPORAL INUNDATION & IMPACT PROJECTION TIMELINE</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Simulated chronological spread across the next 24 hours
            </p>
          </div>
          <span className="text-[10px] text-sky-400 font-bold">SIMULATION INTERVAL: 2-HOUR STEPS</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {prediction.timeline.map((step, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xs border flex flex-col justify-between ${
                step.projectedSeverity === 'CRITICAL'
                  ? 'bg-red-950/20 border-red-500/50'
                  : 'bg-[#111827] border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-bold text-xs">{step.timeOffset}</span>
                  <StatusBadge
                    label={step.projectedSeverity}
                    variant={step.projectedSeverity === 'CRITICAL' ? 'critical' : 'high'}
                    size="xs"
                  />
                </div>

                <div className="space-y-1.5 text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
                  <div className="flex justify-between">
                    <span>INUNDATION:</span>
                    <span className="text-slate-200 font-bold">
                      {step.inundationAreaSqKm.toLocaleString()} km²
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>URGENCY:</span>
                    <span className="text-amber-400 font-bold">{step.evacuationUrgency}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CASUALTY RISK:</span>
                    <span className="text-red-400 font-bold">{step.casualtyRiskIndex}/100</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/60 text-[10px] text-slate-500 text-center">
                Step #{idx + 1}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. AI RECOMMENDATIONS */}
      <div className="rounded-xs border border-slate-800 bg-[#0F172A] p-5 shadow-md">
        <div className="border-b border-slate-800 pb-3 mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold font-mono uppercase text-white tracking-wider flex items-center space-x-2">
              <Zap className="h-4 w-4 text-amber-400" />
              <span>AI-RECOMMENDED MITIGATION INTERVENTIONS</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Ranked prescriptive actions calculated to yield maximum risk reduction
            </p>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold">
            PROJECTED TOTAL IMPACT REDUCTION: -46.1%
          </span>
        </div>

        <div className="space-y-3">
          {prediction.recommendations.map((rec) => (
            <div
              key={rec.id}
              className="p-3.5 rounded-xs border border-slate-800 bg-[#111827] hover:border-slate-700 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center space-x-2">
                  <StatusBadge
                    label={rec.priority}
                    variant={
                      rec.priority === 'IMMEDIATE'
                        ? 'critical'
                        : rec.priority === 'HIGH_PRIORITY'
                        ? 'high'
                        : 'neutral'
                    }
                    size="xs"
                  />
                  <span className="text-[10px] px-1.5 py-0.2 rounded-xs bg-slate-800 text-slate-300 font-bold">
                    {rec.category}
                  </span>
                  <span className="text-xs font-bold text-white font-sans">{rec.title}</span>
                </div>
                <p className="text-xs font-sans text-slate-300 pl-0.5">{rec.action}</p>
              </div>

              <div className="flex items-center space-x-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                <div className="text-right">
                  <div className="text-[10px] text-slate-500 uppercase">RISK OFFSET</div>
                  <div className="text-emerald-400 font-bold text-xs">
                    -{rec.impactScoreReduction}% Threat
                  </div>
                </div>

                <Button
                  size="sm"
                  variant={authorizedRecommendations.has(rec.id) ? 'outline' : 'default'}
                  className={`text-[11px] space-x-1 ${
                    authorizedRecommendations.has(rec.id)
                      ? 'border-emerald-600/50 text-emerald-400 bg-emerald-950/20'
                      : ''
                  }`}
                  onClick={() => authorizeAction(rec.id)}
                >
                  {authorizedRecommendations.has(rec.id) ? (
                    <>
                      <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                      <span>ACTION AUTHORIZED</span>
                    </>
                  ) : (
                    <>
                      <span>AUTHORIZE ACTION</span>
                      <ArrowRight className="h-3 w-3" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
