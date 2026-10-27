import React from 'react';
import { useBlackboardSync } from './useBlackboardSync';

export interface BlackboardSyncBridgeProps {
  children: React.ReactNode;
}

/**
 * Global component that establishes the reactive bridge between the existing
 * Disaster Management contexts and the AI Blackboard shared memory.
 */
export const BlackboardSyncBridge: React.FC<BlackboardSyncBridgeProps> = ({ children }) => {
  useBlackboardSync();
  return <>{children}</>;
};
