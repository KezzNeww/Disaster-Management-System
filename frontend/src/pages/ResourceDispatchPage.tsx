
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';

export function ResourceDispatchPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold tracking-tight text-white font-mono">
              TACTICAL RESOURCE DISPATCH & FLEET CONTROL
            </h1>
            <Badge variant="success">FLEET OPTIMAL</Badge>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Real-time tracking and algorithmic dispatch for drone swarms, medical convoys, and rescue personnel.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">AUTO-ALLOCATE FLEET</Button>
          <Button variant="default" size="sm">COMMISSION NEW SQUAD</Button>
        </div>
      </div>

      {/* Fleet Units Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { id: 'DRONE-SWARM-ALPHA', type: 'Surveillance Drone Fleet', status: 'DEPLOYED', battery: '78%', eta: '4 mins', incident: 'INC-2026-091' },
          { id: 'MED-CONVOY-04', type: 'Mobile Field Hospital', status: 'EN_ROUTE', battery: '92%', eta: '18 mins', incident: 'INC-2026-090' },
          { id: 'SAR-SQUAD-EAGLE', type: 'Search & Rescue Specialists', status: 'DEPLOYED', battery: '85%', eta: 'On Scene', incident: 'INC-2026-089' },
          { id: 'AIRDROP-HELO-02', type: 'Heavy Cargo Supply Helicopter', status: 'IDLE', battery: '100%', eta: 'Ready', incident: 'STANDBY' },
          { id: 'BOAT-RESCUE-07', type: 'Amphibious Evacuation Vessels', status: 'DEPLOYED', battery: '64%', eta: 'On Scene', incident: 'INC-2026-091' },
          { id: 'DRONE-SWARM-BETA', type: 'Thermal Sensor Drone Swarm', status: 'IDLE', battery: '98%', eta: 'Ready', incident: 'STANDBY' },
        ].map((unit) => (
          <Card key={unit.id} className="border-slate-800 bg-[#0F172A]/90 hover:border-slate-700 transition-colors">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="font-mono text-xs text-sky-400">{unit.id}</CardTitle>
                <Badge
                  variant={unit.status === 'DEPLOYED' ? 'telemetry' : unit.status === 'EN_ROUTE' ? 'warning' : 'secondary'}
                  className="text-[9px]"
                >
                  {unit.status}
                </Badge>
              </div>
              <CardDescription className="font-sans text-slate-300">{unit.type}</CardDescription>
            </CardHeader>
            <CardContent className="font-mono text-xs space-y-2">
              <div className="flex justify-between text-slate-400">
                <span>ASSIGNED TARGET:</span>
                <span className="text-slate-200">{unit.incident}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>FUEL / BATTERY:</span>
                <span className="text-emerald-400">{unit.battery}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>ETA:</span>
                <span className="text-slate-200">{unit.eta}</span>
              </div>
              <div className="pt-2 border-t border-slate-800/80 flex justify-end">
                <Button variant="outline" size="sm" className="w-full">
                  OVERRIDE FLIGHT PATH
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
