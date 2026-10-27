import { IAIProvider } from './AIProvider';
import { GeneratedReport, ReportContext, ReportType, AIProviderConfig } from './types';
import { PromptBuilder } from './PromptBuilder';
import { MockProvider } from './MockProvider';

/**
 * OpenAIProvider integrates OpenAI Chat Completions API with the Classical Expert System.
 *
 * Strict Architecture Rules:
 * 1. The Expert System decides ALL operational parameters, risk levels, and actions.
 * 2. OpenAI ONLY formats structured facts into professional prose.
 * 3. Failsafe: If the API key is absent, the network fails, or OpenAI errors/times out,
 *    it automatically and silently falls back to MockProvider (Local AI Mode).
 *    The application NEVER crashes.
 */
export class OpenAIProvider implements IAIProvider {
  public readonly name = 'OpenAI Generative Engine (GPT-4o / GPT-4o-mini)';
  public readonly type = 'OPENAI' as const;

  private fallbackProvider: MockProvider;
  private config: AIProviderConfig;

  constructor(config?: AIProviderConfig) {
    this.fallbackProvider = new MockProvider();
    this.config = {
      apiKey: config?.apiKey || (import.meta.env.VITE_OPENAI_API_KEY as string) || '',
      model: config?.model || (import.meta.env.VITE_OPENAI_MODEL as string) || 'gpt-4o-mini',
      temperature: config?.temperature ?? 0.2,
      timeoutMs: config?.timeoutMs ?? 10000,
    };
  }

  public setApiKey(key: string): void {
    this.config.apiKey = key.trim();
  }

  public getApiKey(): string {
    return this.config.apiKey || '';
  }

  public async isAvailable(): Promise<boolean> {
    return Boolean(this.config.apiKey && this.config.apiKey.length > 10);
  }

  public async generateReport(type: ReportType, context: ReportContext): Promise<GeneratedReport> {
    const startTime = performance.now();

    // 1. Check if OpenAI API Key is present
    const hasKey = await this.isAvailable();
    if (!hasKey) {
      console.info('[OpenAIProvider] No API key detected. Running in Local AI Mode via MockProvider.');
      return this.fallbackProvider.generateReport(type, context);
    }

    // 2. Build structured prompt with strict guardrails
    const { systemPrompt, userPrompt } = PromptBuilder.buildPrompt(type, context);

    // 3. Attempt OpenAI API call with timeout
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeoutMs || 10000);

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          model: this.config.model,
          temperature: this.config.temperature,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorBody = await response.text().catch(() => '');
        console.warn(`[OpenAIProvider] OpenAI API error (${response.status}): ${errorBody}. Falling back to Local AI Mode.`);
        return this.fallbackProvider.generateReport(type, context);
      }

      const json = await response.json();
      const rawContent: string = json.choices?.[0]?.message?.content || '';

      if (!rawContent.trim()) {
        console.warn('[OpenAIProvider] Received empty response from OpenAI. Falling back to Local AI Mode.');
        return this.fallbackProvider.generateReport(type, context);
      }

      const latency = Math.round(performance.now() - startTime);
      const title = this.getReportTitle(type, context.disaster.name);
      const summary = rawContent.slice(0, 180).replace(/\n/g, ' ') + '...';

      return {
        id: `rep-openai-${Date.now()}`,
        type,
        title,
        content: rawContent,
        summary,
        provider: 'OPENAI',
        providerName: `Expert System + OpenAI (${this.config.model})`,
        mode: 'OpenAI Mode',
        generatedAt: new Date().toISOString(),
        generationTimeMs: latency,
        confidence: context.confidence,
        triggeredRulesCount: context.triggeredRules.length,
        version: 'v2.5-HYBRID',
        metadata: {
          model: this.config.model,
          finishReason: json.choices?.[0]?.finish_reason,
          tokens: json.usage?.total_tokens,
        },
      };
    } catch (err: any) {
      const isAbort = err?.name === 'AbortError';
      console.warn(
        `[OpenAIProvider] Request failed (${isAbort ? 'Timeout' : err?.message || 'Network'}). Falling back to Local AI Mode.`
      );
      return this.fallbackProvider.generateReport(type, context);
    }
  }

  public async generateOfficerBrief(context: ReportContext): Promise<GeneratedReport> {
    return this.generateReport('OFFICER_BRIEF', context);
  }

  public async generateSituationReport(context: ReportContext): Promise<GeneratedReport> {
    return this.generateReport('SITUATION_REPORT', context);
  }

  public async generateExecutiveSummary(context: ReportContext): Promise<GeneratedReport> {
    return this.generateReport('EXECUTIVE_SUMMARY', context);
  }

  public async generatePublicAdvisory(context: ReportContext): Promise<GeneratedReport> {
    return this.generateReport('PUBLIC_ADVISORY', context);
  }

  private getReportTitle(type: ReportType, disasterName: string): string {
    switch (type) {
      case 'OFFICER_BRIEF':
        return `Tactical Field Briefing - ${disasterName}`;
      case 'SITUATION_REPORT':
        return `National Situation Report (SITREP) - ${disasterName}`;
      case 'EXECUTIVE_SUMMARY':
        return `Executive Strategic Summary - ${disasterName}`;
      case 'PUBLIC_ADVISORY':
        return `Civil Protection Emergency Advisory - ${disasterName}`;
    }
  }
}
