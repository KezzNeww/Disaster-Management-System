import { WorldState, ReasoningTraceItem, AgentStatusItem } from './WorldState';

export type BlackboardListener = (state: WorldState) => void;

export class Blackboard {
  private state: WorldState;
  private listeners: Set<BlackboardListener> = new Set();
  private traceCounter: number = 1;

  constructor(initialState: WorldState) {
    this.state = { ...initialState };
  }

  /**
   * Returns a snapshot of the current World State.
   */
  public getState(): WorldState {
    return this.state;
  }

  /**
   * Overwrites the World State and notifies all active listeners.
   */
  public setState(newState: WorldState): void {
    this.state = {
      ...newState,
      lastUpdated: new Date().toISOString(),
    };
    this.notify();
  }

  /**
   * Performs a partial atomic update to the World State.
   */
  public updateState(updater: Partial<WorldState> | ((prev: WorldState) => Partial<WorldState>)): void {
    const patch = typeof updater === 'function' ? updater(this.state) : updater;
    this.state = {
      ...this.state,
      ...patch,
      lastUpdated: new Date().toISOString(),
    };
    this.notify();
  }

  /**
   * Appends an Explainable AI (XAI) reasoning trace item to the Blackboard shared memory.
   */
  public addReasoningTrace(item: {
    source: string;
    category: string;
    observation: string;
    inference: string;
    confidence?: number;
  }): void {
    const traceEntry: ReasoningTraceItem = {
      step: this.traceCounter++,
      timestamp: new Date().toISOString(),
      source: item.source,
      category: item.category,
      observation: item.observation,
      inference: item.inference,
      confidence: item.confidence ?? 0.9,
    };

    this.state = {
      ...this.state,
      reasoningTrace: [...this.state.reasoningTrace, traceEntry],
    };
    this.notify();
  }

  /**
   * Updates an agent's operational status and contribution summary in shared memory.
   */
  public updateAgentStatus(
    agentName: string,
    status: 'ONLINE' | 'PROCESSING' | 'IDLE' | 'ERROR',
    contribution: string
  ): void {
    const existing: AgentStatusItem = this.state.agentStatuses[agentName] || {
      agentName,
      status: 'IDLE',
      lastProcessedAt: new Date().toISOString(),
      contributionSummary: '',
    };

    const updated: AgentStatusItem = {
      ...existing,
      status,
      lastProcessedAt: new Date().toISOString(),
      contributionSummary: contribution,
    };

    this.state = {
      ...this.state,
      agentStatuses: {
        ...this.state.agentStatuses,
        [agentName]: updated,
      },
    };
    this.notify();
  }

  /**
   * Clears reasoning traces for a fresh analysis cycle.
   */
  public clearTrace(): void {
    this.traceCounter = 1;
    this.state = {
      ...this.state,
      reasoningTrace: [],
    };
    this.notify();
  }

  /**
   * Subscribes a listener function that receives live updates whenever the blackboard state mutates.
   * Returns an unsubscribe function.
   */
  public subscribe(listener: BlackboardListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    for (const listener of this.listeners) {
      try {
        listener(this.state);
      } catch (err) {
        console.error('[Blackboard] Listener error:', err);
      }
    }
  }
}
