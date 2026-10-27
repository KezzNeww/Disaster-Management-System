import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { WorldState } from '../core/WorldState';
import { Database, CloudRain, Users, Building2, HeartPulse, Truck, Navigation } from 'lucide-react';

export interface WorldStateCardProps {
  worldState: WorldState;
  className?: string;
}

export const WorldStateCard: React.FC<WorldStateCardProps> = ({ worldState, className }) => {
  const { weather, population, infrastructure, hospitals, resources, roads } = worldState;

  const waterDeficit = resources.potableWaterLiters.required - resources.potableWaterLiters.available;
  const foodDeficit = resources.foodRationsKits.required - resources.foodRationsKits.available;

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xs bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Database className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-sm font-semibold tracking-wide">Blackboard Shared World State</CardTitle>
            <p className="text-[11px] font-mono text-slate-400">Live Environmental Telemetry & Lifeline Inventory</p>
          </div>
        </div>
        <Badge variant="telemetry" className="font-mono text-[10px]">
          SHARED MEMORY ACTIVE
        </Badge>
      </CardHeader>

      <CardContent className="space-y-4 pt-1">
        {/* Telemetry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Weather Telemetry */}
          <div className="rounded-xs border border-slate-800 bg-[#0B0F17]/80 p-3 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-cyan-400">
              <CloudRain className="h-3.5 w-3.5" />
              <span>Weather Telemetry</span>
            </div>
            <div className="space-y-1 font-mono text-xs">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Precipitation:</span>
                <span className="font-bold text-cyan-300">{weather.rainfallMm} mm</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Sustained Wind:</span>
                <span>{weather.windSpeedKmph} km/h</span>
              </div>
              {weather.stormSurgeMeters !== undefined && (
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Storm Surge:</span>
                  <span className="text-rose-400 font-bold">+{weather.stormSurgeMeters} m</span>
                </div>
              )}
              {weather.riverLevelMeters !== undefined && (
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">River Stage:</span>
                  <span className="text-amber-400 font-bold">
                    {weather.riverLevelMeters} m (Threshold {weather.riverFloodStageMeters}m)
                  </span>
                </div>
              )}
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Barometer:</span>
                <span>{weather.barometricPressureHpa} hPa</span>
              </div>
            </div>
          </div>

          {/* Population Exposure */}
          <div className="rounded-xs border border-slate-800 bg-[#0B0F17]/80 p-3 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-rose-400">
              <Users className="h-3.5 w-3.5" />
              <span>Human Exposure</span>
            </div>
            <div className="space-y-1 font-mono text-xs">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Total Affected:</span>
                <span className="font-bold text-slate-100">{population.totalAffected.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Stranded in Hazard:</span>
                <span className="text-rose-400 font-bold">{population.strandedCount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Evacuated to Safety:</span>
                <span className="text-emerald-400">{population.evacuatedCount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Density:</span>
                <span>{population.densityPerSqKm}/sq km</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Compliance Rate:</span>
                <span>{Math.round(population.evacuationComplianceRate * 100)}%</span>
              </div>
            </div>
          </div>

          {/* Infrastructure Fragility */}
          <div className="rounded-xs border border-slate-800 bg-[#0B0F17]/80 p-3 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-amber-400">
              <Building2 className="h-3.5 w-3.5" />
              <span>Infrastructure Damage</span>
            </div>
            <div className="space-y-1 font-mono text-xs">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Bridges Collapsed:</span>
                <span className={infrastructure.bridgesCollapsed > 0 ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                  {infrastructure.bridgesCollapsed}
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Power Substations Down:</span>
                <span className={infrastructure.substationsDamaged > 0 ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                  {infrastructure.substationsDamaged}
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Cell Towers Offline:</span>
                <span>{infrastructure.cellularTowersOffline}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Embankment Breaches:</span>
                <span className={infrastructure.criticalEmbankmentsBreached > 0 ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                  {infrastructure.criticalEmbankmentsBreached}
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Structural Damage:</span>
                <span>{infrastructure.structuralDamagePercentage}%</span>
              </div>
            </div>
          </div>

          {/* Medical & Hospital Stress */}
          <div className="rounded-xs border border-slate-800 bg-[#0B0F17]/80 p-3 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-emerald-400">
              <HeartPulse className="h-3.5 w-3.5" />
              <span>Medical Capacity</span>
            </div>
            <div className="space-y-1 font-mono text-xs">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">ICU Beds Available:</span>
                <span className={hospitals.icuBedsAvailable <= 5 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                  {hospitals.icuBedsAvailable} beds
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Backup Generators:</span>
                <span className={hospitals.backupGeneratorsOperational ? 'text-emerald-400' : 'text-rose-400 font-bold'}>
                  {hospitals.backupGeneratorsOperational ? 'OPERATIONAL' : 'FAILED'}
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Oxygen Reserves:</span>
                <span>{hospitals.medicalOxygenSupplyHours} Hours</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Trauma Surge Load:</span>
                <span>{hospitals.traumaSurgeCapacityPercent}%</span>
              </div>
            </div>
          </div>

          {/* Logistics & Resources */}
          <div className="rounded-xs border border-slate-800 bg-[#0B0F17]/80 p-3 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-purple-400">
              <Truck className="h-3.5 w-3.5" />
              <span>Logistics & Shortfalls</span>
            </div>
            <div className="space-y-1 font-mono text-xs">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Rescue Boats:</span>
                <span>
                  {resources.rescueBoats.available} avail / {resources.rescueBoats.total} total
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Ambulance Fleet:</span>
                <span>
                  {resources.ambulances.available} avail / {resources.ambulances.total} total
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Water Deficit:</span>
                <span className={waterDeficit > 0 ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                  {waterDeficit > 0 ? `-${waterDeficit.toLocaleString()} L` : 'STABLE'}
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Food Deficit:</span>
                <span className={foodDeficit > 0 ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                  {foodDeficit > 0 ? `-${foodDeficit.toLocaleString()} kits` : 'STABLE'}
                </span>
              </div>
            </div>
          </div>

          {/* Transit Corridors */}
          <div className="rounded-xs border border-slate-800 bg-[#0B0F17]/80 p-3 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-sky-400">
              <Navigation className="h-3.5 w-3.5" />
              <span>Transit Corridors ({roads.length})</span>
            </div>
            <div className="space-y-1.5 font-mono text-[11px]">
              {roads.slice(0, 3).map((r) => (
                <div key={r.id} className="flex items-center justify-between text-slate-300">
                  <span className="truncate max-w-[150px]">{r.name}</span>
                  <Badge
                    variant={r.status === 'IMPASSABLE' ? 'destructive' : r.status === 'CLEAR' ? 'success' : 'warning'}
                    className="text-[8px] px-1 py-0"
                  >
                    {r.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
