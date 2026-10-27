import { GeneratedReport, ReportContext, ReportType, AIProviderMode } from './types';

/**
 * Standard interface for all Generative AI Report Providers.
 * Providers receive structured facts from the Expert System and articulate them into human-readable reports.
 */
export interface IAIProvider {
  readonly name: string;
  readonly type: AIProviderMode;

  /**
   * Evaluates if the provider is currently available (e.g. check API key or local capability).
   */
  isAvailable(): Promise<boolean>;

  /**
   * Generates a concise tactical field briefing for on-scene commanders.
   */
  generateOfficerBrief(context: ReportContext): Promise<GeneratedReport>;

  /**
   * Generates an official multi-agency Situation Report (SITREP).
   */
  generateSituationReport(context: ReportContext): Promise<GeneratedReport>;

  /**
   * Generates a high-level strategic brief for cabinet ministers and state leadership.
   */
  generateExecutiveSummary(context: ReportContext): Promise<GeneratedReport>;

  /**
   * Generates a calm, actionable civil defense advisory for the public.
   */
  generatePublicAdvisory(context: ReportContext): Promise<GeneratedReport>;

  /**
   * Generic generation method delegating by report type.
   */
  generateReport(type: ReportType, context: ReportContext): Promise<GeneratedReport>;
}
