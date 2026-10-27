import { Blackboard } from './Blackboard';

export interface AgentExecutionContext {
  agentName: string;
  category: string;
  blackboard: Blackboard;
  logTrace: (observation: string, inference: string, confidence?: number) => void;
}

export interface IBlackboardAgent {
  readonly name: string;
  readonly category: string;
  execute(context: AgentExecutionContext): Promise<void> | void;
}
