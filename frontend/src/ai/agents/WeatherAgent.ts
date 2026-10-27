import { IBlackboardAgent, AgentExecutionContext } from '../core/AgentContext';
import { AIInsight, AIRecommendation } from '../types';

export class WeatherAgent implements IBlackboardAgent {
  public readonly name = 'WeatherAgent';
  public readonly category = 'ENVIRONMENTAL_TELEMETRY';

  public execute(context: AgentExecutionContext): void {
    const { blackboard, logTrace } = context;
    const state = blackboard.getState();
    const weather = state.weather;

    blackboard.updateAgentStatus(this.name, 'PROCESSING', 'Analyzing atmospheric telemetry...');

    const insights: AIInsight[] = [];
    const recommendations: AIRecommendation[] = [];

    // Observation 1: Precipitation & Hydrology
    if (weather.rainfallMm >= 150) {
      logTrace(
        `Precipitation telemetry confirms ${weather.rainfallMm} mm cumulative rainfall.`,
        'Flash inundation threshold exceeded across downstream water catchment basins.',
        0.95
      );
      insights.push({
        id: `insight-weather-rain-${Date.now()}`,
        type: 'WEATHER',
        title: 'Severe Rainfall Accumulation Detected',
        description: `Monitored rainfall at ${weather.rainfallMm}mm exceeds maximum retention capacity of regional soils.`,
        severity: weather.rainfallMm >= 200 ? 'CRITICAL' : 'HIGH',
        timestamp: new Date().toISOString(),
        metrics: { rainfallMm: weather.rainfallMm, trend: weather.forecastTrend },
        sourceAgent: this.name,
      });
    }

    // Observation 2: Sustained Gale Winds & Storm Surge
    if (weather.windSpeedKmph >= 100 || (weather.stormSurgeMeters ?? 0) >= 2.0) {
      logTrace(
        `Peak winds at ${weather.windSpeedKmph} km/h with surge cresting at ${weather.stormSurgeMeters ?? 0}m.`,
        'Structural aerodynamic loading threatens unreinforced infrastructure and open berthing facilities.',
        0.96
      );
      insights.push({
        id: `insight-weather-surge-${Date.now()}`,
        type: 'WEATHER',
        title: 'High Velocity Cyclonic Surge Threat',
        description: `Gale force winds of ${weather.windSpeedKmph} km/h combined with a ${weather.stormSurgeMeters ?? 0}m surge crest.`,
        severity: weather.windSpeedKmph >= 130 ? 'CRITICAL' : 'HIGH',
        timestamp: new Date().toISOString(),
        metrics: {
          windSpeedKmph: weather.windSpeedKmph,
          stormSurgeMeters: weather.stormSurgeMeters ?? 0,
        },
        sourceAgent: this.name,
      });

      recommendations.push({
        id: `rec-weather-grounding-${Date.now()}`,
        priority: 'IMMEDIATE',
        category: 'WEATHER',
        title: 'Declare Marine & Aerial Fleet Tethering Mandate',
        action: 'Ground all non-emergency flight operations and tether maritime vessels to high-tensile moorings.',
        impactScoreReduction: 16,
        reasoning: `Atmospheric velocity (${weather.windSpeedKmph} km/h) exceeds safe operational envelope.`,
        sourceAgent: this.name,
        confidence: 0.95,
        timestamp: new Date().toISOString(),
      });
    }

    // Observation 3: Barometric Trend
    if (weather.barometricPressureHpa < 970) {
      logTrace(
        `Barometric core pressure registered at ${weather.barometricPressureHpa} hPa.`,
        'Steep pressure gradient indicates a rapidly organizing and intensifying storm structure.',
        0.92
      );
    }

    // Update Blackboard
    blackboard.updateState((prev) => ({
      insights: [...prev.insights.filter((i) => i.sourceAgent !== this.name), ...insights],
      generatedRecommendations: [
        ...prev.generatedRecommendations.filter((r) => r.sourceAgent !== this.name),
        ...recommendations,
      ],
    }));

    blackboard.updateAgentStatus(
      this.name,
      'ONLINE',
      `Processed ${weather.conditionDescription} telemetry. ${insights.length} environmental insights generated.`
    );
  }
}
