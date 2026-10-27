import { useState, useEffect } from 'react';
import { Disaster } from '../types';

export interface UseDisastersState {
  disasters: Disaster[];
  selectedDisaster: Disaster | null;
  isLoading: boolean;
  error: Error | null;
}

export function useDisasters() {
  const [state, setState] = useState<UseDisastersState>({
    disasters: [],
    selectedDisaster: null,
    isLoading: false,
    error: null,
  });

  const selectDisaster = (id: string | null) => {
    setState((prev) => ({
      ...prev,
      selectedDisaster: prev.disasters.find((d) => d.id === id) || null,
    }));
  };

  const refreshDisasters = async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    // Stub implementation for skeleton
    setState((prev) => ({ ...prev, isLoading: false }));
  };

  useEffect(() => {
    refreshDisasters();
  }, []);

  return {
    ...state,
    selectDisaster,
    refreshDisasters,
  };
}
