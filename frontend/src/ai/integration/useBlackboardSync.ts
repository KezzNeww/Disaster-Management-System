import { useEffect, useRef } from 'react';
import { useDisasterContext } from '../../context/DisasterContext';
import { useResourceContext } from '../../context/ResourceContext';
import { useRouteContext } from '../../context/RouteContext';
import { useAlertContext } from '../../context/AlertContext';
import { aiService } from '../services';
import { mapAppContextToWorldState, AppSyncData } from './syncUtils';

/**
 * Hook that listens to all primary Disaster Management contexts,
 * synchronizes state into the Blackboard, and debounces automated AI reasoning cycles.
 */
export function useBlackboardSync(debounceMs: number = 400) {
  const { currentDisaster, selectedDisaster, disasters } = useDisasterContext();
  const { inventory } = useResourceContext();
  const { blockedRoads, safeRoute, shortestRoute, activeRouteType } = useRouteContext();
  const { alerts } = useAlertContext();

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const blackboard = aiService.getBlackboard();

  useEffect(() => {
    const syncData: AppSyncData = {
      currentDisaster,
      selectedDisaster,
      disasters,
      inventory,
      blockedRoads,
      alerts,
      safeRoute,
      shortestRoute,
      activeRouteType,
    };

    // 1. Sync live application state into Blackboard memory
    const statePatch = mapAppContextToWorldState(syncData, blackboard.getState());
    blackboard.updateState(statePatch);

    // 2. Debounce execution of RuleEngine, Agents, and DecisionEngine
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      aiService.runFullAnalysis().catch((err) => {
        console.warn('[BlackboardSyncBridge] Debounced AI analysis cycle notice:', err);
      });
    }, debounceMs);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [
    currentDisaster,
    selectedDisaster,
    disasters,
    inventory,
    blockedRoads,
    alerts,
    safeRoute,
    shortestRoute,
    activeRouteType,
    blackboard,
    debounceMs,
  ]);
}
