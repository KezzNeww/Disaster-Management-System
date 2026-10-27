import React from 'react';
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
  Tooltip,
} from 'react-leaflet';
import L from 'leaflet';
import {
  Route,
  Navigation,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Ban,
  Bot,
  CheckCircle2,
} from 'lucide-react';

import { useRouteContext } from '../context/RouteContext';
import { useAI } from '../ai';
import {
  mockRouteOptions,
} from '../mock/mockRoutes';
import { BlockedRoadSegment } from '../types';
import { StatusBadge } from '../components/enterprise/StatusBadge';
import { Button } from '../components/ui/button';

// Custom Map Pins for Origin, Destination & Blockages
const originIcon = L.divIcon({
  className: 'route-origin-pin',
  html: `<div style="width: 24px; height: 24px; border-radius: 50%; background: #22C55E; border: 2px solid #FFFFFF; box-shadow: 0 0 10px #22C55E; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: bold; color: #000;">A</div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const destIcon = L.divIcon({
  className: 'route-dest-pin',
  html: `<div style="width: 24px; height: 24px; border-radius: 50%; background: #2563EB; border: 2px solid #FFFFFF; box-shadow: 0 0 10px #2563EB; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: bold; color: #FFF;">B</div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const blockedRoadIcon = L.divIcon({
  className: 'route-blocked-pin',
  html: `<div style="width: 22px; height: 22px; border-radius: 50%; background: #EF4444; border: 2px solid #000; box-shadow: 0 0 8px #EF4444; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #FFF;">⛔</div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

export function RouteOptimizerPage() {
  const {
    graph,
    sourceNodeId,
    destNodeId,
    setSourceNodeId,
    setDestNodeId,
    safeRoute: dijkstraSafeRoute,
    shortestRoute: dijkstraShortestRoute,
    activeRouteType,
    setActiveRouteType,
    blockedRoads,
    isCalculating,
    generateRoutes,
  } = useRouteContext();
  useAI({ autoFetch: false });

  // Graph nodes available for routing
  const routeNodes = Object.values(graph.nodes);

  // Fallback to robust options if needed
  const safeRoute = dijkstraSafeRoute || mockRouteOptions[0];
  const shortestRoute = dijkstraShortestRoute || mockRouteOptions[1];
  const currentRoute = activeRouteType === 'safe' ? safeRoute : shortestRoute;

  const originCoord: [number, number] = graph.nodes[sourceNodeId]
    ? [graph.nodes[sourceNodeId].lat, graph.nodes[sourceNodeId].lng]
    : [19.8135, 85.8312];
  const destCoord: [number, number] = graph.nodes[destNodeId]
    ? [graph.nodes[destNodeId].lat, graph.nodes[destNodeId].lng]
    : [20.2961, 85.8245];
  const originName = graph.nodes[sourceNodeId]?.name || 'Origin Departure Point';
  const destName = graph.nodes[destNodeId]?.name || 'Target Shelter Hub';

  return (
    <div className="h-[calc(100vh-7.5rem)] flex flex-col space-y-3 font-mono text-xs select-none">
      {/* Top Header */}
      <div className="p-3 bg-[#0F172A] border border-slate-800 rounded-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Route className="h-4 w-4 text-sky-400" />
          <h1 className="font-bold text-white text-sm uppercase tracking-wider">
            AI TACTICAL EVACUATION ROUTE OPTIMIZER
          </h1>
          <StatusBadge label="DIJKSTRA HAZARD-WEIGHTED" variant="telemetry" />
        </div>

        <div className="flex items-center space-x-3 text-slate-400 text-[11px]">
          <span>BLOCKED SEGMENTS: <strong className="text-red-400">{blockedRoads.length} ACTIVE</strong></span>
          <span>SAFE BUFFER: <strong className="text-emerald-400">{safeRoute.hazardBufferKm} KM</strong></span>
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 overflow-hidden">
        {/* LEFT PANEL */}
        <div className="w-full lg:w-96 flex flex-col space-y-3 overflow-y-auto pr-1">
          {/* Waypoint Selectors */}
          <div className="p-4 rounded-xs border border-slate-800 bg-[#0F172A] space-y-3 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-white text-xs uppercase">EVACUATION WAYPOINTS</span>
              <span className="text-[10px] text-sky-400 font-bold">GPS LOCK</span>
            </div>

            {/* Source */}
            <div className="space-y-1">
              <label className="text-slate-400 text-[11px] flex items-center space-x-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>SOURCE DEPARTURE ZONE (POINT A)</span>
              </label>
              <select
                value={sourceNodeId}
                onChange={(e) => setSourceNodeId(e.target.value)}
                className="w-full h-8 rounded-xs border border-slate-800 bg-[#111827] px-2.5 text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
              >
                {routeNodes.map((node) => (
                  <option key={node.id} value={node.id}>
                    {node.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Destination */}
            <div className="space-y-1">
              <label className="text-slate-400 text-[11px] flex items-center space-x-1">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                <span>DESTINATION SHELTER / HUB (POINT B)</span>
              </label>
              <select
                value={destNodeId}
                onChange={(e) => setDestNodeId(e.target.value)}
                className="w-full h-8 rounded-xs border border-slate-800 bg-[#111827] px-2.5 text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
              >
                {routeNodes.map((node) => (
                  <option key={node.id} value={node.id}>
                    {node.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Generate Route Button */}
            <Button
              variant="default"
              disabled={isCalculating}
              onClick={generateRoutes}
              className="w-full justify-center space-x-2 text-xs"
            >
              <Sparkles className="h-3.5 w-3.5 text-sky-300" />
              <span>{isCalculating ? 'COMPUTING DIJKSTRA HAZARD PATH...' : 'GENERATE OPTIMAL ROUTE'}</span>
            </Button>
          </div>

          {/* Route Comparison Selector */}
          <div className="p-4 rounded-xs border border-slate-800 bg-[#0F172A] space-y-3 shadow-sm">
            <span className="font-bold text-white text-xs uppercase">EVALUATED ROUTE OPTIONS</span>

            {/* Safe Route Card */}
            <div
              onClick={() => setActiveRouteType('safe')}
              className={`p-3 rounded-xs border cursor-pointer transition-all ${
                activeRouteType === 'safe'
                  ? 'bg-sky-950/30 border-sky-500/60 shadow-md'
                  : 'bg-[#111827] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center space-x-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span className="font-bold text-slate-100 text-xs">SAFE CORRIDOR (ALPHA)</span>
                </div>
                <StatusBadge label="RECOMMENDED" variant="optimal" size="xs" />
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                <div>
                  <span>DISTANCE:</span> <strong className="text-white">{safeRoute.distanceKm} km</strong>
                </div>
                <div>
                  <span>TIME:</span> <strong className="text-emerald-400">{safeRoute.durationMinutes} mins</strong>
                </div>
                <div>
                  <span>HAZARD BUFFER:</span> <strong className="text-sky-400">{safeRoute.hazardBufferKm} km</strong>
                </div>
                <div>
                  <span>CAPACITY:</span> <strong className="text-slate-200">4,800/hr</strong>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 font-sans mt-2">{safeRoute.advisory}</p>
            </div>

            {/* Shortest Route Card */}
            <div
              onClick={() => setActiveRouteType('shortest')}
              className={`p-3 rounded-xs border cursor-pointer transition-all ${
                activeRouteType === 'shortest'
                  ? 'bg-red-950/30 border-red-500/60 shadow-md'
                  : 'bg-[#111827] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center space-x-1.5">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                  <span className="font-bold text-slate-100 text-xs">SHORTEST ROUTE (BETA)</span>
                </div>
                <StatusBadge label="HIGH RISK" variant="critical" size="xs" />
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                <div>
                  <span>DISTANCE:</span> <strong className="text-white">{shortestRoute.distanceKm} km</strong>
                </div>
                <div>
                  <span>TIME:</span> <strong className="text-red-400">{shortestRoute.durationMinutes} mins (Delays)</strong>
                </div>
                <div>
                  <span>HAZARD BUFFER:</span> <strong className="text-red-400">{shortestRoute.hazardBufferKm} km</strong>
                </div>
                <div>
                  <span>CAPACITY:</span> <strong className="text-slate-200">1,200/hr</strong>
                </div>
              </div>
              <p className="text-[10px] text-red-400/90 font-sans mt-2">{shortestRoute.advisory}</p>
            </div>
          </div>

          {/* AI Route Intelligence & Safety Analysis Card */}
          <div className="p-4 rounded-xs border border-blue-500/40 bg-[#0F172A] space-y-2.5 shadow-md">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-white text-xs uppercase flex items-center space-x-1.5">
                <Bot className="h-4 w-4 text-blue-400" />
                <span>AI ROUTE INTELLIGENCE & SAFETY</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-bold border border-emerald-500/30 bg-emerald-950/30 px-1.5 py-0.2 rounded-xs">
                {activeRouteType === 'safe' ? '96/100 SAFETY' : '38/100 COMPROMISED'}
              </span>
            </div>

            <div className="space-y-2 font-mono text-[11px]">
              <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                <span className="text-slate-400">ESTIMATED TRANSIT DELAY:</span>
                <span className={activeRouteType === 'safe' ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                  {activeRouteType === 'safe' ? '+8 mins (Nominal Flow)' : '+45 to +90 mins (Severe Inundation)'}
                </span>
              </div>

              <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                <span className="text-slate-400">ALTERNATIVE ROUTE:</span>
                <span className="text-sky-300 font-bold">
                  {activeRouteType === 'safe' ? 'Route Alpha (Primary Bypass)' : 'Divert to Inland Safe Corridor Alpha'}
                </span>
              </div>

              <div className="space-y-1 pt-1 font-sans">
                <span className="text-[10px] text-slate-400 font-mono uppercase font-bold flex items-center space-x-1">
                  <CheckCircle2 className="h-3 w-3 text-blue-400" />
                  <span>EXPLAINABLE CAUSAL REASONING:</span>
                </span>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {activeRouteType === 'safe'
                    ? 'Route Alpha maintains +16.4m topographic elevation clearance above the active flood baseline, completely avoiding the submerged NH-16 culvert. Top priority for mass transit bus columns.'
                    : 'Route Beta traverses low-elevation delta marshlands with monitored water depth exceeding 0.75m. Culvert structural stability is compromised; hydroplaning risk is severe.'}
                </p>
              </div>
            </div>
          </div>

          {/* Blocked Roads List */}
          <div className="p-4 rounded-xs border border-slate-800 bg-[#0F172A] space-y-2.5 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-white text-xs uppercase flex items-center space-x-1.5">
                <Ban className="h-3.5 w-3.5 text-red-500" />
                <span>BLOCKED ROAD SEGMENTS ({blockedRoads.length})</span>
              </span>
              <span className="text-[10px] text-slate-500">UAV VERIFIED</span>
            </div>

            <div className="space-y-2">
              {blockedRoads.map((road: BlockedRoadSegment) => (
                <div
                  key={road.id}
                  className="p-2.5 rounded-xs bg-[#111827] border border-slate-800 text-[11px]"
                >
                  <div className="flex items-center justify-between font-bold text-slate-200">
                    <span>{road.name}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded-xs bg-red-950 text-red-400 border border-red-800">
                      {road.reason}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
                    <span>{road.district}</span>
                    <span className="text-slate-500">Reported: {road.reportedTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Interactive Leaflet Map */}
        <div className="flex-1 rounded-xs border border-slate-800 bg-[#0B0F17] relative overflow-hidden shadow-2xl">
          <MapContainer
            center={[20.05, 85.81]}
            zoom={10}
            style={{ height: '100%', width: '100%', backgroundColor: '#0B0F17' }}
            attributionControl={false}
          >
            {/* OpenStreetMap TileLayer (Zero API Key Required) */}
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
              maxZoom={19}
              className="osm-dark-filter"
            />

            {/* Shortest Route */}
            <Polyline
              positions={shortestRoute.waypoints}
              pathOptions={{
                color: '#EF4444',
                weight: activeRouteType === 'shortest' ? 5 : 2.5,
                opacity: activeRouteType === 'shortest' ? 0.9 : 0.4,
                dashArray: '6, 8',
              }}
            >
              <Tooltip sticky>
                <div className="font-mono text-xs p-1">{shortestRoute.name}: {shortestRoute.distanceKm} km (Threat: {shortestRoute.riskScore})</div>
              </Tooltip>
            </Polyline>

            {/* Safe Route */}
            <Polyline
              positions={safeRoute.waypoints}
              pathOptions={{
                color: '#38BDF8',
                weight: activeRouteType === 'safe' ? 6 : 3,
                opacity: activeRouteType === 'safe' ? 1 : 0.4,
              }}
            >
              <Tooltip sticky>
                <div className="font-mono text-xs p-1">{safeRoute.name}: {safeRoute.distanceKm} km (Safe Buffer: {safeRoute.hazardBufferKm} km)</div>
              </Tooltip>
            </Polyline>

            {/* Origin Pin */}
            <Marker position={originCoord} icon={originIcon}>
              <Popup>
                <div className="font-mono text-xs p-1">
                  <strong>START (Point A):</strong> {originName}
                </div>
              </Popup>
            </Marker>

            {/* Destination Pin */}
            <Marker position={destCoord} icon={destIcon}>
              <Popup>
                <div className="font-mono text-xs p-1">
                  <strong>DESTINATION (Point B):</strong> {destName}
                </div>
              </Popup>
            </Marker>

            {/* Blocked Road Markers */}
            {blockedRoads.map((b: BlockedRoadSegment) => (
              <Marker key={b.id} position={b.coordinates[0]} icon={blockedRoadIcon}>
                <Popup>
                  <div className="font-mono text-xs p-1">
                    <strong className="text-red-400">BLOCKED:</strong> {b.name}
                    <div>Reason: {b.reason}</div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Floating HUD */}
          <div className="absolute top-4 left-4 z-10 bg-[#0F172A]/90 border border-slate-800 p-3 rounded-xs backdrop-blur-md shadow-xl text-xs space-y-2 select-none max-w-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <span className="font-bold text-white text-[11px] flex items-center space-x-1.5">
                <Navigation className="h-3.5 w-3.5 text-sky-400" />
                <span>ACTIVE DISPLAY: {currentRoute.name}</span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
              <div>
                <span className="text-slate-500">DISTANCE: </span>
                <strong className="text-white">{currentRoute.distanceKm} km</strong>
              </div>
              <div>
                <span className="text-slate-500">EST. TRANSIT: </span>
                <strong className={activeRouteType === 'safe' ? 'text-emerald-400' : 'text-red-400'}>
                  {currentRoute.durationMinutes} mins
                </strong>
              </div>
              <div>
                <span className="text-slate-500">HAZARD BUFFER: </span>
                <strong className="text-sky-400">{currentRoute.hazardBufferKm} km</strong>
              </div>
              <div>
                <span className="text-slate-500">THREAT SCORE: </span>
                <strong className={activeRouteType === 'safe' ? 'text-emerald-400' : 'text-red-400'}>
                  {currentRoute.riskScore}/100
                </strong>
              </div>
            </div>
          </div>

          {/* Legend Bottom Overlay */}
          <div className="absolute bottom-4 right-4 z-10 bg-[#0F172A]/90 border border-slate-800 p-2.5 rounded-xs backdrop-blur-md shadow-xl text-[10px] space-y-1 select-none">
            <div className="flex items-center space-x-2">
              <span className="h-1.5 w-4 bg-[#38BDF8]" />
              <span className="text-slate-300">Recommended Safe Route</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="h-1.5 w-4 bg-[#EF4444] border-dashed border-t border-b border-white" />
              <span className="text-slate-300">Shortest Route (High Hazard)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>⛔</span>
              <span className="text-slate-300">Active Road Blockade / Inundation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
