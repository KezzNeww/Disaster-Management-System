import { IAIProvider } from './AIProvider';
import { MockProvider } from './MockProvider';
import { OpenAIProvider } from './OpenAIProvider';
import { ReportContext, ReportType, GeneratedReport, AIProviderMode } from './types';

export * from './types';
export * from './AIProvider';
export * from './MockProvider';
export * from './OpenAIProvider';
export * from './PromptBuilder';
export * from './ReportFormatter';

/**
 * Hybrid LLM Service managing active report generators, automatic fallbacks,
 * and seamless switching between Local AI Mode and OpenAI Mode.
 */
class HybridReportService {
  private mockProvider: MockProvider;
  private openAIProvider: OpenAIProvider;
  private activeMode: AIProviderMode = 'MOCK';

  constructor() {
    this.mockProvider = new MockProvider();
    this.openAIProvider = new OpenAIProvider();

    // Default to MOCK as specified: "MockProvider is the default provider."
    // If VITE_OPENAI_API_KEY is detected in environment, OpenAIProvider is ready.
    if (import.meta.env.VITE_OPENAI_API_KEY) {
      this.activeMode = 'OPENAI';
    }
  }

  public getActiveProvider(): IAIProvider {
    return this.activeMode === 'OPENAI' ? this.openAIProvider : this.mockProvider;
  }

  public getActiveMode(): AIProviderMode {
    return this.activeMode;
  }

  public setActiveMode(mode: AIProviderMode): void {
    this.activeMode = mode;
  }

  public setOpenAIApiKey(key: string): void {
    this.openAIProvider.setApiKey(key);
    if (key.trim()) {
      this.activeMode = 'OPENAI';
    }
  }

  public getOpenAIApiKey(): string {
    return this.openAIProvider.getApiKey();
  }

  public async isOnlineAvailable(): Promise<boolean> {
    return this.openAIProvider.isAvailable();
  }

  public async generateReport(type: ReportType, context: ReportContext): Promise<GeneratedReport> {
    const provider = this.getActiveProvider();
    try {
      return await provider.generateReport(type, context);
    } catch (err) {
      console.warn('[HybridReportService] Error during provider execution. Falling back to MockProvider.', err);
      return await this.mockProvider.generateReport(type, context);
    }
  }
}

export const hybridReportService = new HybridReportService();
