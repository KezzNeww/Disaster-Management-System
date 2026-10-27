import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import {
  REGIONAL_ROAD_GRAPH,
  calculateDijkstraRoute,
  DijkstraPathResult,
  RoadNetworkGraph,
} from '../utils/algorithms/dijkstraRouter';
import { mockBlockedRoads } from '../mock/mockRoutes';
import { BlockedRoadSegment } from '../types';

interface RouteContextType {
  graph: RoadNetworkGraph;
  sourceNodeId: string;
  destNodeId: string;
  setSourceNodeId: (id: string) => void;
  setDestNodeId: (id: string) => void;
  safeRoute: DijkstraPathResult | null;
  shortestRoute: DijkstraPathResult | null;
  activeRouteType: 'safe' | 'shortest';
  setActiveRouteType: (type: 'safe' | 'shortest') => void;
  blockedRoads: BlockedRoadSegment[];
  isCalculating: boolean;
  generateRoutes: () => void;
  toggleBlockade: (edgeId: string) => void;
  simulateRoadBlockade: () => void;
}

const RouteContext = createContext<RouteContextType | undefined>(undefined);

export function RouteProvider({ children }: { children: React.ReactNode }) {
  const [graph] = useState<RoadNetworkGraph>(REGIONAL_ROAD_GRAPH);
  const [sourceNodeId, setSourceNodeId] = useState<string>('NODE_PURI_BEACH');
  const [destNodeId, setDestNodeId] = useState<string>('NODE_BHUBANESWAR_HUB');
  const [activeRouteType, setActiveRouteType] = useState<'safe' | 'shortest'>('safe');
  const [dynamicBlockedEdgeIds, setDynamicBlockedEdgeIds] = useState<Set<string>>(new Set(['EDGE_NH316_DIRECT']));
  const [blockedRoads] = useState<BlockedRoadSegment[]>(mockBlockedRoads);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  // Calculate Safe and Shortest routes using Dijkstra
  const safeRoute = useMemo(() => {
    return calculateDijkstraRoute(graph, sourceNodeId, destNodeId, 'safe', dynamicBlockedEdgeIds);
  }, [graph, sourceNodeId, destNodeId, dynamicBlockedEdgeIds]);

  const shortestRoute = useMemo(() => {
    return calculateDijkstraRoute(graph, sourceNodeId, destNodeId, 'shortest', dynamicBlockedEdgeIds);
  }, [graph, sourceNodeId, destNodeId, dynamicBlockedEdgeIds]);

  const generateRoutes = useCallback(() => {
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
    }, 400);
  }, []);

  const toggleBlockade = useCallback((edgeId: string) => {
    setDynamicBlockedEdgeIds((prev) => {
      const next = new Set(prev);
      if (next.has(edgeId)) {
        next.delete(edgeId);
      } else {
        next.add(edgeId);
      }
      return next;
    });
  }, []);

  // Live simulation: dynamically block/unblock a sector road
  const simulateRoadBlockade = useCallback(() => {
    const candidateEdges = ['EDGE_NH316_DIRECT', 'EDGE_PIPLI_BBSR', 'EDGE_DELANG_BYPASS'];
    const randomEdge = candidateEdges[Math.floor(Math.random() * candidateEdges.length)];

    setDynamicBlockedEdgeIds((prev) => {
      const next = new Set(prev);
      if (next.has(randomEdge)) {
        next.delete(randomEdge);
      } else {
        next.add(randomEdge);
      }
      return next;
    });
  }, []);

  return (
    <RouteContext.Provider
      value={{
        graph,
        sourceNodeId,
        destNodeId,
        setSourceNodeId,
        setDestNodeId,
        safeRoute,
        shortestRoute,
        activeRouteType,
        setActiveRouteType,
        blockedRoads,
        isCalculating,
        generateRoutes,
        toggleBlockade,
        simulateRoadBlockade,
      }}
    >
      {children}
    </RouteContext.Provider>
  );
}

export function useRouteContext() {
  const context = useContext(RouteContext);
  if (!context) {
    throw new Error('useRouteContext must be used within a RouteProvider');
  }
  return context;
}
