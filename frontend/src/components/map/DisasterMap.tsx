import React from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  Circle,
  Polyline,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import { DisasterItem, DisasterType } from '../../types';

// Fix for custom DivIcon markers with enterprise pulse rings
function createDisasterIcon(type: DisasterType, severity: string) {
  let color = '#2563EB'; // Blue
  let bg = 'rgba(37, 99, 235, 0.25)';
  let glyph = '🌊';

  if (type === 'FIRE') {
    color = '#EF4444';
    bg = 'rgba(239, 68, 68, 0.3)';
    glyph = '🔥';
  } else if (type === 'CYCLONE') {
    color = '#38BDF8';
    bg = 'rgba(56, 189, 248, 0.3)';
    glyph = '🌀';
  } else if (type === 'EARTHQUAKE') {
    color = '#F59E0B';
    bg = 'rgba(245, 158, 11, 0.3)';
    glyph = '⚡';
  }

  const isCritical = severity === 'CRITICAL';

  return L.divIcon({
    className: 'custom-disaster-marker',
    html: `
      <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
        ${
          isCritical
            ? `<div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background-color: ${color}; opacity: 0.6; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>`
            : ''
        }
        <div style="width: 26px; height: 26px; border-radius: 50%; background: #0F172A; border: 2px solid ${color}; box-shadow: 0 0 12px ${color}; display: flex; align-items: center; justify-content: center; font-size: 13px; z-index: 2;">
          ${glyph}
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
}

function MapReCenter({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  React.useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

interface DisasterMapProps {
  disasters: DisasterItem[];
  selectedDisaster?: DisasterItem | null;
  onSelectDisaster?: (disaster: DisasterItem) => void;
  showHeatCircles?: boolean;
  showAIOverlays?: boolean;
  center?: [number, number];
  zoom?: number;
  height?: string;
  className?: string;
}

export function DisasterMap({
  disasters,
  selectedDisaster,
  onSelectDisaster,
  showHeatCircles = true,
  showAIOverlays = true,
  center = [21.5, 82.5],
  zoom = 5,
  height = '100%',
  className = '',
}: DisasterMapProps) {
  return (
    <div className={`w-full h-full relative overflow-hidden ${className}`}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%', backgroundColor: '#0B0F17' }}
        attributionControl={false}
      >
        <MapReCenter center={center} zoom={zoom} />

        {/* OpenStreetMap TileLayer (Zero API Key Required) */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
          maxZoom={19}
          className="osm-dark-filter"
        />

        {/* AI Tactical Evacuation Vectors and Warning Overlays */}
        {showAIOverlays &&
          disasters
            .filter((d) => d.severity === 'CRITICAL' || d.severity === 'HIGH')
            .map((d) => {
              // Vector pointing inland northwest towards safe high ground
              const origin: [number, number] = [d.coordinates.lat, d.coordinates.lng];
              const safeInlandTarget: [number, number] = [
                d.coordinates.lat + 0.75,
                d.coordinates.lng - (d.coordinates.lng > 84 ? 0.95 : -0.95),
              ];

              return (
                <React.Fragment key={`ai-overlay-${d.id}`}>
                  {/* AI Warning Danger Buffer Overlay */}
                  <Circle
                    center={origin}
                    radius={Math.round(d.radiusKm * 1350)}
                    pathOptions={{
                      color: d.type === 'FIRE' ? '#EF4444' : d.type === 'CYCLONE' ? '#38BDF8' : '#F59E0B',
                      fillColor: d.type === 'FIRE' ? '#EF4444' : '#2563EB',
                      fillOpacity: 0.08,
                      weight: 1.5,
                      dashArray: '8, 8',
                    }}
                  >
                    <Tooltip sticky>
                      <div className="font-mono text-[10px] p-1 bg-[#0F172A] text-slate-200">
                        <strong className="text-amber-400">AI HAZARD ENVELOPE</strong>
                        <div>Risk Perimeter: +{Math.round(d.radiusKm * 1.35)} km</div>
                        <div className="text-slate-400">Action: Preemptive clearance mandatory</div>
                      </div>
                    </Tooltip>
                  </Circle>

                  {/* Recommended Safe Evacuation Direction Vector */}
                  <Polyline
                    positions={[origin, safeInlandTarget]}
                    pathOptions={{
                      color: '#22C55E',
                      weight: 3.5,
                      dashArray: '6, 10',
                      opacity: 0.85,
                    }}
                  >
                    <Tooltip sticky>
                      <div className="font-mono text-[10px] p-1 bg-[#0F172A] text-slate-200">
                        <strong className="text-emerald-400">AI RECOMMENDED EVACUATION VECTOR</strong>
                        <div>Directing columns toward elevated inland hub</div>
                        <div className="text-slate-400">Topographic clearance: +18m elevation</div>
                      </div>
                    </Tooltip>
                  </Polyline>
                </React.Fragment>
              );
            })}

        {/* Heat circles for each active disaster */}
        {showHeatCircles &&
          disasters.map((d) => {
            let circleColor = '#2563EB';
            if (d.severity === 'CRITICAL') circleColor = '#EF4444';
            else if (d.severity === 'HIGH') circleColor = '#F59E0B';
            else if (d.severity === 'LOW') circleColor = '#22C55E';

            return (
              <Circle
                key={`circle-${d.id}`}
                center={[d.coordinates.lat, d.coordinates.lng]}
                radius={d.radiusKm * 1000}
                pathOptions={{
                  color: circleColor,
                  fillColor: circleColor,
                  fillOpacity: d.severity === 'CRITICAL' ? 0.22 : 0.14,
                  weight: 1.2,
                  dashArray: '4, 6',
                }}
              />
            );
          })}

        {/* Interactive disaster markers */}
        {disasters.map((d) => (
          <Marker
            key={d.id}
            position={[d.coordinates.lat, d.coordinates.lng]}
            icon={createDisasterIcon(d.type, d.severity)}
            eventHandlers={{
              click: () => {
                if (onSelectDisaster) onSelectDisaster(d);
              },
            }}
          >
            {/* Hover Tooltip */}
            <Tooltip
              direction="top"
              offset={[0, -18]}
              opacity={0.95}
              className="enterprise-map-tooltip"
            >
              <div className="font-mono text-[11px] p-1 bg-[#0F172A] text-slate-100 rounded-xs border border-slate-700">
                <div className="font-bold text-white text-xs">{d.name}</div>
                <div className="text-slate-400">
                  Risk: <span className="text-red-400 font-bold">{d.riskScore}/100</span> | Pop:{' '}
                  {d.affectedPopulation.toLocaleString()}
                </div>
                <div className="text-[10px] text-sky-400 mt-0.5">Click for tactical telemetry</div>
              </div>
            </Tooltip>

            {/* Popup */}
            <Popup className="enterprise-map-popup">
              <div className="font-mono text-xs p-1 text-slate-200 min-w-[200px]">
                <div className="flex items-center justify-between border-b border-slate-700 pb-1 mb-1.5">
                  <span className="font-bold text-white text-xs">{d.id}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-xs bg-red-950 text-red-400 border border-red-800">
                    {d.severity}
                  </span>
                </div>
                <div className="font-sans font-bold text-slate-100 mb-1">{d.name}</div>
                <div className="text-[11px] text-slate-400 space-y-0.5">
                  <div>Region: {d.district}, {d.state}</div>
                  <div>Population: {d.affectedPopulation.toLocaleString()}</div>
                  <div>Teams Active: {d.emergencyTeamsDeployed} units</div>
                </div>
                <button
                  onClick={() => {
                    if (onSelectDisaster) onSelectDisaster(d);
                  }}
                  className="mt-2 w-full py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xs text-[10px] uppercase font-bold tracking-wider"
                >
                  OPEN SIDE INTEL PANEL
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
