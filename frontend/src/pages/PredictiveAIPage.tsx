import { Play, RotateCcw, TrendingUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';

export function PredictiveAIPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold tracking-tight text-white font-mono">
              AI PREDICTIVE PROPAGATION SIMULATOR
            </h1>
            <Badge variant="telemetry">NEURAL ENGINE ACTIVE</Badge>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Monte Carlo spread simulation, hydrologic neural forecasting, and automated evacuation route computing.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="space-x-1">
            <RotateCcw className="h-3.5 w-3.5" />
            <span>RESET MODEL</span>
          </Button>
          <Button variant="default" size="sm" className="space-x-1">
            <Play className="h-3.5 w-3.5" />
            <span>EXECUTE SIMULATION</span>
          </Button>
        </div>
      </div>

      {/* Simulator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Model Parameters Panel */}
        <Card className="border-slate-800 bg-[#0F172A]/90">
          <CardHeader>
            <CardTitle className="font-mono text-sm">SIMULATION PARAMETERS</CardTitle>
            <CardDescription>Adjust atmospheric and geographic factors</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 font-mono text-xs">
            <div className="space-y-1">
              <label className="text-slate-400">SURGE VELOCITY (KM/H)</label>
              <div className="h-2 rounded bg-slate-800 overflow-hidden">
                <div className="h-full bg-blue-600 w-3/5" />
              </div>
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>0 km/h</span>
                <span className="text-sky-400">42 km/h</span>
                <span>120 km/h</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400">PRECIPITATION RATE (MM/HR)</label>
              <div className="h-2 rounded bg-slate-800 overflow-hidden">
                <div className="h-full bg-sky-500 w-4/5" />
              </div>
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>0 mm/h</span>
                <span className="text-sky-400">85 mm/h</span>
                <span>150 mm/h</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400">ACTIVE MODEL ENSEMBLE</label>
              <div className="p-2 rounded-xs bg-[#111827] border border-slate-800 text-slate-200">
                HYDROLOGIC-FLOOD-NET-V4 (TRANSFORMER)
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Prediction Trajectory Graph / Visualizer Placeholder */}
        <Card className="lg:col-span-2 border-slate-800 bg-[#0F172A]/90">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-800/80">
            <div>
              <CardTitle className="font-mono text-sm">
                24-HOUR THREAT TRAJECTORY (RECHARTS READY)
              </CardTitle>
              <CardDescription>Forecast confidence interval & evacuation threshold</CardDescription>
            </div>
            <Badge variant="secondary">MONTE CARLO (N=10,000)</Badge>
          </CardHeader>
          <CardContent className="h-72 flex flex-col items-center justify-center border-dashed border border-slate-800 m-4 rounded-xs bg-[#0B0F17]">
            <TrendingUp className="h-8 w-8 text-sky-500/50 animate-pulse mb-2" />
            <span className="font-mono text-xs text-slate-400">
              [RECHARTS TIME-SERIES LINE / AREA CHART CONTAINER]
            </span>
            <span className="font-mono text-[10px] text-slate-600 mt-1">
              Telemetry series: Water level (m), Inundation area (sq km), Casualty risk score
            </span>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
