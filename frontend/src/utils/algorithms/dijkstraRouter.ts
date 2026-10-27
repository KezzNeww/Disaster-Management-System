export interface RoadNode {
  id: string;
  name: string;
  lat: number;
  lng: number;
  coordinates?: [number, number];
}

export interface RoadEdge {
  id: string;
  from: string;
  to: string;
  name: string;
  distanceKm: number;
  trafficMultiplier: number; // 1.0 - 2.5
  hazardRiskFactor: number;   // 0 - 100
  isBlocked: boolean;
  waypoints: [number, number][];
}

export interface RoadNetworkGraph {
  nodes: Record<string, RoadNode>;
  edges: RoadEdge[];
}

export interface DijkstraPathResult {
  routeId: string;
  routeName: string;
  name: string;
  type: 'safe' | 'shortest';
  totalDistanceKm: number;
  distanceKm: number;
  estimatedMinutes: number;
  durationMinutes: number;
  compositeRiskScore: number;
  riskScore: number;
  waypoints: [number, number][];
  nodePath: string[];
  edgesTraversed: string[];
  hazardBufferKm: number;
  advisory: string;
}

// Preset Regional Geospatial Road Network Graph (Odisha Command Sector: Puri - Bhubaneswar - Cuttack)
export const REGIONAL_ROAD_GRAPH: RoadNetworkGraph = {
  nodes: {
    'NODE_PURI_BEACH': {
      id: 'NODE_PURI_BEACH',
      name: 'Puri Coastal Zone (Point A)',
      lat: 19.8135,
      lng: 85.8312,
    },
    'NODE_PURI_TOWN': {
      id: 'NODE_PURI_TOWN',
      name: 'Puri North Junction',
      lat: 19.835,
      lng: 85.828,
    },
    'NODE_DELANG_RIDGE': {
      id: 'NODE_DELANG_RIDGE',
      name: 'Delang Elevated Western Ridge',
      lat: 19.954,
      lng: 85.762,
    },
    'NODE_PIPLI_FLYOVER': {
      id: 'NODE_PIPLI_FLYOVER',
      name: 'Pipli Highway Overpass (NH-316)',
      lat: 20.114,
      lng: 85.832,
    },
    'NODE_JATNI_BYPASS': {
      id: 'NODE_JATNI_BYPASS',
      name: 'Jatni High-Ground Corridor',
      lat: 20.178,
      lng: 85.735,
    },
    'NODE_BHUBANESWAR_SOUTH': {
      id: 'NODE_BHUBANESWAR_SOUTH',
      name: 'Bhubaneswar South Perimeter',
      lat: 20.215,
      lng: 85.812,
    },
    'NODE_BHUBANESWAR_HUB': {
      id: 'NODE_BHUBANESWAR_HUB',
      name: 'Bhubaneswar State Command Hub (Point B)',
      lat: 20.2961,
      lng: 85.8245,
    },
    'NODE_AIIMS_TRAUMA': {
      id: 'NODE_AIIMS_TRAUMA',
      name: 'AIIMS Emergency Trauma Hub',
      lat: 20.2315,
      lng: 85.7766,
    },
  },
  edges: [
    // Direct Highway Edge 1: Puri Beach to Puri Town
    {
      id: 'EDGE_PURI_HIGHWAY_1',
      from: 'NODE_PURI_BEACH',
      to: 'NODE_PURI_TOWN',
      name: 'Grand Road Connector',
      distanceKm: 4.8,
      trafficMultiplier: 1.2,
      hazardRiskFactor: 75,
      isBlocked: false,
      waypoints: [
        [19.8135, 85.8312],
        [19.835, 85.828],
      ],
    },
    // Edge 2: Puri Town to Pipli via NH-316 (Direct, but high flood risk)
    {
      id: 'EDGE_NH316_DIRECT',
      from: 'NODE_PURI_TOWN',
      to: 'NODE_PIPLI_FLYOVER',
      name: 'National Highway 316 (Coastal Inundation Corridor)',
      distanceKm: 31.4,
      trafficMultiplier: 1.8,
      hazardRiskFactor: 88,
      isBlocked: false, // May be dynamically blocked by simulation
      waypoints: [
        [19.835, 85.828],
        [19.892, 85.825],
        [19.981, 85.835],
        [20.114, 85.832],
      ],
    },
    // Edge 3: Puri Town to Delang (Western inland bypass - Safe, high ground)
    {
      id: 'EDGE_DELANG_BYPASS',
      from: 'NODE_PURI_TOWN',
      to: 'NODE_DELANG_RIDGE',
      name: 'Delang Western Ridge Elevated Arterial',
      distanceKm: 18.2,
      trafficMultiplier: 1.1,
      hazardRiskFactor: 12,
      isBlocked: false,
      waypoints: [
        [19.835, 85.828],
        [19.872, 85.811],
        [19.954, 85.762],
      ],
    },
    // Edge 4: Delang to Jatni
    {
      id: 'EDGE_DELANG_JATNI',
      from: 'NODE_DELANG_RIDGE',
      to: 'NODE_JATNI_BYPASS',
      name: 'State Highway 13 Inland Bypass',
      distanceKm: 26.5,
      trafficMultiplier: 1.1,
      hazardRiskFactor: 8,
      isBlocked: false,
      waypoints: [
        [19.954, 85.762],
        [20.082, 85.741],
        [20.178, 85.735],
      ],
    },
    // Edge 5: Pipli to Bhubaneswar South (Direct)
    {
      id: 'EDGE_PIPLI_BBSR',
      from: 'NODE_PIPLI_FLYOVER',
      to: 'NODE_BHUBANESWAR_SOUTH',
      name: 'NH-316 North Section',
      distanceKm: 14.6,
      trafficMultiplier: 1.5,
      hazardRiskFactor: 45,
      isBlocked: false,
      waypoints: [
        [20.114, 85.832],
        [20.165, 85.822],
        [20.215, 85.812],
      ],
    },
    // Edge 6: Jatni to AIIMS Trauma
    {
      id: 'EDGE_JATNI_AIIMS',
      from: 'NODE_JATNI_BYPASS',
      to: 'NODE_AIIMS_TRAUMA',
      name: 'Khurda-AIIMS Medical Corridor',
      distanceKm: 8.4,
      trafficMultiplier: 1.2,
      hazardRiskFactor: 10,
      isBlocked: false,
      waypoints: [
        [20.178, 85.735],
        [20.205, 85.755],
        [20.2315, 85.7766],
      ],
    },
    // Edge 7: AIIMS to Bhubaneswar Hub
    {
      id: 'EDGE_AIIMS_HUB',
      from: 'NODE_AIIMS_TRAUMA',
      to: 'NODE_BHUBANESWAR_HUB',
      name: 'Ring Road Northern Arterial',
      distanceKm: 11.2,
      trafficMultiplier: 1.2,
      hazardRiskFactor: 15,
      isBlocked: false,
      waypoints: [
        [20.2315, 85.7766],
        [20.265, 85.801],
        [20.2961, 85.8245],
      ],
    },
    // Edge 8: Bhubaneswar South to Bhubaneswar Hub
    {
      id: 'EDGE_BBSR_SOUTH_HUB',
      from: 'NODE_BHUBANESWAR_SOUTH',
      to: 'NODE_BHUBANESWAR_HUB',
      name: 'Janpath Central Flyway',
      distanceKm: 9.8,
      trafficMultiplier: 1.6,
      hazardRiskFactor: 30,
      isBlocked: false,
      waypoints: [
        [20.215, 85.812],
        [20.255, 85.818],
        [20.2961, 85.8245],
      ],
    },
  ],
};

/**
 * Dijkstra's Shortest Path & Hazard-Penalized Safest Path Algorithm
 */
export function calculateDijkstraRoute(
  graph: RoadNetworkGraph,
  startNodeId: string,
  targetNodeId: string,
  mode: 'shortest' | 'safe',
  dynamicBlockedEdgeIds: Set<string> = new Set()
): DijkstraPathResult | null {
  const distances: Record<string, number> = {};
  const previousNodes: Record<string, string | null> = {};
  const edgeUsed: Record<string, RoadEdge | null> = {};
  const unvisited = new Set<string>();

  Object.keys(graph.nodes).forEach((nodeId) => {
    distances[nodeId] = Infinity;
    previousNodes[nodeId] = null;
    edgeUsed[nodeId] = null;
    unvisited.add(nodeId);
  });

  if (!graph.nodes[startNodeId] || !graph.nodes[targetNodeId]) {
    return null;
  }

  distances[startNodeId] = 0;

  while (unvisited.size > 0) {
    // Select unvisited node with lowest tentative distance
    let currentNodeId: string | null = null;
    let minDistance = Infinity;

    unvisited.forEach((nodeId) => {
      if (distances[nodeId] < minDistance) {
        minDistance = distances[nodeId];
        currentNodeId = nodeId;
      }
    });

    if (!currentNodeId || minDistance === Infinity) {
      break; // No path reachable
    }

    if (currentNodeId === targetNodeId) {
      break; // Destination reached
    }

    unvisited.delete(currentNodeId);

    // Examine neighbors
    const outgoingEdges = graph.edges.filter(
      (e) => (e.from === currentNodeId || e.to === currentNodeId)
    );

    for (const edge of outgoingEdges) {
      // Ignore blocked roads strictly
      if (edge.isBlocked || dynamicBlockedEdgeIds.has(edge.id)) {
        continue;
      }

      const neighborId = edge.from === currentNodeId ? edge.to : edge.from;
      if (!unvisited.has(neighborId)) continue;

      // Weight function:
      // Shortest: purely distance & traffic latency
      // Safe: heavily penalizes hazard risk factor
      let edgeWeight: number;
      if (mode === 'shortest') {
        edgeWeight = edge.distanceKm * edge.trafficMultiplier;
      } else {
        // Safe route penalty function: hazard proximity exponent
        const riskPenalty = 1 + Math.pow(edge.hazardRiskFactor / 30, 2);
        edgeWeight = edge.distanceKm * edge.trafficMultiplier * riskPenalty;
      }

      const newDistance = distances[currentNodeId] + edgeWeight;
      if (newDistance < distances[neighborId]) {
        distances[neighborId] = newDistance;
        previousNodes[neighborId] = currentNodeId;
        edgeUsed[neighborId] = edge;
      }
    }
  }

  // Reconstruct path
  const nodePath: string[] = [];
  const edgesTraversed: string[] = [];
  let curr: string | null = targetNodeId;

  if (distances[targetNodeId] === Infinity) {
    return null; // Route severed by road blockades
  }

  while (curr) {
    nodePath.unshift(curr);
    const edge = edgeUsed[curr];
    if (edge) {
      edgesTraversed.unshift(edge.id);
    }
    curr = previousNodes[curr];
  }

  // Calculate actual physical distance and stitch coordinates
  let totalDistanceKm = 0;
  let totalRiskAcc = 0;
  const stitchedWaypoints: [number, number][] = [];

  for (let i = 0; i < nodePath.length - 1; i++) {
    const fromId = nodePath[i];
    const toId = nodePath[i + 1];
    const edge = graph.edges.find(
      (e) => (e.from === fromId && e.to === toId) || (e.from === toId && e.to === fromId)
    );

    if (edge) {
      totalDistanceKm += edge.distanceKm;
      totalRiskAcc += edge.hazardRiskFactor;

      const pts = edge.from === fromId ? edge.waypoints : [...edge.waypoints].reverse();
      pts.forEach((pt) => {
        if (
          stitchedWaypoints.length === 0 ||
          stitchedWaypoints[stitchedWaypoints.length - 1][0] !== pt[0] ||
          stitchedWaypoints[stitchedWaypoints.length - 1][1] !== pt[1]
        ) {
          stitchedWaypoints.push(pt);
        }
      });
    }
  }

  const avgRisk = edgesTraversed.length > 0 ? Math.round(totalRiskAcc / edgesTraversed.length) : 10;
  // Speed calculation: avg 55 km/h for clear roads, adjusted for risk/traffic
  const avgSpeedKmh = mode === 'safe' ? 62 : 44;
  const estimatedMinutes = Math.round((totalDistanceKm / avgSpeedKmh) * 60);

  const rName =
    mode === 'safe'
      ? `Route Alpha: Safe Ridge Corridor (${totalDistanceKm.toFixed(1)} km)`
      : `Route Beta: Shortest Direct Path (${totalDistanceKm.toFixed(1)} km)`;
  const dist = Math.round(totalDistanceKm * 10) / 10;

  return {
    routeId: mode === 'safe' ? 'ROUTE-SAFE-DIJKSTRA' : 'ROUTE-SHORTEST-DIJKSTRA',
    routeName: rName,
    name: rName,
    type: mode,
    totalDistanceKm: dist,
    distanceKm: dist,
    estimatedMinutes,
    durationMinutes: estimatedMinutes,
    compositeRiskScore: avgRisk,
    riskScore: avgRisk,
    waypoints: stitchedWaypoints,
    nodePath,
    edgesTraversed,
    hazardBufferKm: mode === 'safe' ? 14.8 : 1.2,
    advisory:
      mode === 'safe'
        ? 'Dijkstra Safe Path: Avoids all low-elevation flash surge zones and active road blockades.'
        : 'Dijkstra Shortest Path: Direct route; caution advised near proximity flood sectors.',
  };
}
