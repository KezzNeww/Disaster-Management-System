import { ReportContext, ReportType } from './types';

/**
 * Builds structured prompts for the Generative AI Communication Layer.
 * Strict Ground Truth Principle:
 * The prompt passes only structured facts derived from the Blackboard and Decision Engine.
 * The LLM is explicitly forbidden from making decisions, altering risk indices, or recalculating routes.
 */
export class PromptBuilder {
  /**
   * Generates a pair of system and user prompts tailored to the requested emergency report type.
   */
  public static buildPrompt(
    type: ReportType,
    context: ReportContext
  ): { systemPrompt: string; userPrompt: string } {
    const systemPrompt = this.buildSystemPrompt(type);
    const userPrompt = this.buildUserPrompt(type, context);

    return { systemPrompt, userPrompt };
  }

  private static buildSystemPrompt(type: ReportType): string {
    const baseDirectives = `You are a specialized Emergency Communications Officer for the National Emergency Operations Centre (NEOC).
CRITICAL OPERATIONAL CONSTRAINTS:
1. Ground Truth Authority: All threat levels, risk scores, logistical allocations, and evacuation routes are ALREADY computed by the authoritative Classical Expert System. You MUST NOT calculate new risks, invent resources, or alter directives.
2. Factual Accuracy: Transcribe and synthesize the provided telemetry with absolute fidelity.
3. Tone: Highly professional, objective, decisive, and aligned with international emergency management standards (NDMA/FEMA/UN-OCHA).`;

    switch (type) {
      case 'OFFICER_BRIEF':
        return `${baseDirectives}
DOCUMENT TYPE: TACTICAL FIELD OFFICER BRIEFING
AUDIENCE: Field Incident Commanders, Sector Chiefs, Quick Response Teams.
FORMAT REQUIREMENTS:
- Immediate situational appraisal.
- Key hazards and environmental threats.
- Explicit field directives in numbered priority.
- Logistical corridor notes & communications frequencies.
- Keep it concise, high-density, and actionable.`;

      case 'SITUATION_REPORT':
        return `${baseDirectives}
DOCUMENT TYPE: NATIONAL EMERGENCY SITUATION REPORT (SITREP)
AUDIENCE: Multi-agency coordination cells, Armed Forces liaison, Red Cross, Ministry of Home Affairs.
FORMAT REQUIREMENTS:
- Section 1: Executive Telemetry & Hazard Coordinates
- Section 2: Meteorological & Environmental Envelope
- Section 3: Civilian Exposure, Evacuation & Human Toll
- Section 4: Critical Lifelines & Structural Damage
- Section 5: Healthcare System & Trauma Surge
- Section 6: Logistical Assets & Deficit Mitigation
- Section 7: Action Directives Authorized by Decision Engine
- Section 8: 12-Hour Strategic Forecast & Pre-Positioning`;

      case 'EXECUTIVE_SUMMARY':
        return `${baseDirectives}
DOCUMENT TYPE: MINISTERIAL & EXECUTIVE STRATEGIC SITREP
AUDIENCE: Head of State, Cabinet Crisis Committee, State Governors.
FORMAT REQUIREMENTS:
- Strategic impact assessment (macro humanitarian, infrastructure, and governance risks).
- Inter-state and national defense aid requisitions.
- Civil continuity, emergency powers declaration status, and public reassurance messaging.
- High-level decision milestones requiring executive sign-off.`;

      case 'PUBLIC_ADVISORY':
        return `${baseDirectives}
DOCUMENT TYPE: PUBLIC CIVIL DEFENSE ADVISORY & EMERGENCY BULLETIN
AUDIENCE: General public, coastal & riverine residents, transport travelers.
FORMAT REQUIREMENTS:
- Plain, accessible, and compassionate language.
- Zero jargon, zero sensationalism, completely calm and reassuring.
- Crystal-clear life safety instructions (what to pack, where to move, what never to do).
- Designated shelter assembly points, primary safe evacuation corridor, and emergency radio frequencies.`;
    }
  }

  private static buildUserPrompt(type: ReportType, context: ReportContext): string {
    const {
      disaster,
      threatLevel,
      threatScore,
      confidence,
      population,
      weather,
      infrastructure,
      hospitals,
      roads,
      resources,
      traffic,
      triggeredRules,
      recommendations,
      priorityActions,
      officerNotes,
    } = context;

    const clearRoad = roads.find((r) => r.status === 'CLEAR')?.name || 'Inland High-Elevation Bypass';
    const blockedCount = roads.filter((r) => r.status === 'IMPASSABLE' || r.status === 'FLOOD_WARNING').length;

    return `=== AUTHORITATIVE EXPERT SYSTEM SITUATIONAL TELEMETRY ===

[1. DISASTER & HAZARD PROFILE]
- Incident Identifier: ${disaster.name} (${disaster.id})
- Hazard Classification: ${disaster.type}
- Impact Theater: ${disaster.location} (Radius: ${disaster.radiusKm} km)
- Threat Classification: ${threatLevel} (Deterministic Risk Index: ${threatScore}/100)
- Reasoning Engine Confidence: ${(confidence * 100).toFixed(1)}%
- Time Declared: ${disaster.declaredAt}

[2. METEOROLOGICAL & HYDROLOGICAL TELEMETRY]
- Rainfall: ${weather.rainfallMm} mm
- Sustained Wind Speed: ${weather.windSpeedKmph} km/h
- Barometric Pressure: ${weather.barometricPressureHpa} hPa
- Storm Surge / Flood Crest: ${weather.stormSurgeMeters ? `+${weather.stormSurgeMeters}m surge` : 'N/A'} | River Level: ${weather.riverLevelMeters ? `${weather.riverLevelMeters}m` : 'Normal'}
- Atmospheric Condition: ${weather.conditionDescription}
- Projected Trend: ${weather.forecastTrend}

[3. POPULATION & CASUALTY METRICS]
- Total Affected In Theater: ${population.totalAffected.toLocaleString()}
- Vulnerable Demographics (Elderly/Infants/Bedridden): ${population.highRiskDemographicCount.toLocaleString()}
- Successfully Evacuated: ${population.evacuatedCount.toLocaleString()}
- Stranded / Awaiting Extraction: ${population.strandedCount.toLocaleString()}
- Public Evacuation Compliance Rate: ${(population.evacuationComplianceRate * 100).toFixed(0)}%

[4. CRITICAL INFRASTRUCTURE DAMAGE]
- Arterial Bridges Collapsed: ${infrastructure.bridgesCollapsed}
- Electrical Substations Damaged: ${infrastructure.substationsDamaged}
- Cellular Telecommunication Towers Offline: ${infrastructure.cellularTowersOffline}
- Water Treatment Plants Compromised: ${infrastructure.waterTreatmentPlantsCompromised}
- Embankment / Levee Breaches: ${infrastructure.criticalEmbankmentsBreached}
- Overall Structural Damage Ratio: ${infrastructure.structuralDamagePercentage}%

[5. HEALTHCARE & TRAUMA SURGE]
- Operating Medical Centers: ${hospitals.totalHospitals}
- Available ICU Beds: ${hospitals.icuBedsAvailable}
- Operating at Saturated Capacity: ${hospitals.operatingAtFullCapacity} hospitals
- Trauma Surge Capacity: ${hospitals.traumaSurgeCapacityPercent}%
- Backup Generator Reliability: ${hospitals.backupGeneratorsOperational ? 'FUNCTIONAL' : 'COMPROMISED'}
- Oxygen Reserves Remaining: ${hospitals.medicalOxygenSupplyHours} hours

[6. LOGISTICAL INVENTORY & ASSETS]
- Rescue Watercraft: ${resources.rescueBoats.available} available / ${resources.rescueBoats.total} total
- Advanced Life Support Ambulances: ${resources.ambulances.available} available / ${resources.ambulances.total} total
- Specialist Rescue Teams: ${resources.personnelRescueTeams.available} available
- Potable Water: ${resources.potableWaterLiters.available.toLocaleString()}L available (Deficit: ${(resources.potableWaterLiters.required - resources.potableWaterLiters.available).toLocaleString()}L)
- Food Ration Kits: ${resources.foodRationsKits.available.toLocaleString()} available (Deficit: ${(resources.foodRationsKits.required - resources.foodRationsKits.available).toLocaleString()} kits)
- Primary Evacuation Route: ${clearRoad}
- Severed / Blocked Corridors: ${blockedCount} segments
- Traffic Congestion Level: ${traffic?.overallCongestionLevel || 'HIGH'}

[7. EXPERT SYSTEM TRIGGERED PRODUCTION RULES]
${triggeredRules.map((r, i) => `${i + 1}. [${r.id}] ${r.title || r.name || 'Rule'}${r.explanation ? ` - ${r.explanation}` : ''}`).join('\n')}

[8. AUTHORIZED DECISION ENGINE DIRECTIVES]
${priorityActions.map((a, i) => `${i + 1}. ${a}`).join('\n')}

[9. TOP RECOMMENDATIONS]
${recommendations.map((rec, i) => `${i + 1}. [${rec.priority}] ${rec.title}: ${rec.action} (Reason: ${rec.reasoning || 'N/A'})`).join('\n')}

${officerNotes ? `[10. COMMAND OFFICER SPECIAL NOTES]\n${officerNotes}\n` : ''}
TASK: Transform the above factual data into the requested "${type}" report. Use structured markdown formatting with clear headings, bullet points, and authoritative emergency nomenclature.`;
  }
}
