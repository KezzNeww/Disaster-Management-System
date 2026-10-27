import { IAIProvider } from './AIProvider';
import { GeneratedReport, ReportContext, ReportType } from './types';

/**
 * MockProvider generates demo-quality, institutional-grade emergency reports
 * completely offline using deterministic templates powered by the Classical Expert System.
 * Operates with 0% network dependency as the ultimate failsafe.
 */
export class MockProvider implements IAIProvider {
  public readonly name = 'Mock AI Engine (Offline Neural Template)';
  public readonly type = 'MOCK' as const;

  public async isAvailable(): Promise<boolean> {
    return true; // Always operational locally
  }

  public async generateReport(type: ReportType, context: ReportContext): Promise<GeneratedReport> {
    switch (type) {
      case 'OFFICER_BRIEF':
        return this.generateOfficerBrief(context);
      case 'SITUATION_REPORT':
        return this.generateSituationReport(context);
      case 'EXECUTIVE_SUMMARY':
        return this.generateExecutiveSummary(context);
      case 'PUBLIC_ADVISORY':
        return this.generatePublicAdvisory(context);
    }
  }

  public async generateOfficerBrief(context: ReportContext): Promise<GeneratedReport> {
    const startTime = performance.now();
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
      priorityActions,
      triggeredRules,
    } = context;

    const clearCorridor = roads.find((r) => r.status === 'CLEAR')?.name || 'Inland High-Elevation Bypass (Route Alpha)';
    const timestamp = new Date().toISOString();

    const content = `### 1. TACTICAL OVERVIEW
- **Incident Designation**: ${disaster.name} (${disaster.type})
- **Operation Theater**: ${disaster.location} [Radius: ${disaster.radiusKm} km]
- **Operational Threat Level**: **${threatLevel}** (Risk Index: **${threatScore}/100**)
- **Reasoning Engine Confidence**: ${(confidence * 100).toFixed(1)}% | **Verified Production Rules**: ${triggeredRules.length}

---

### 2. IMMEDIATE COMMAND DIRECTIVES
${priorityActions.map((action, i) => `${i + 1}. **DIRECTIVE [OP-${i + 1}]**: ${action}`).join('\n')}

---

### 3. HAZARD PROFILE & ENVIRONMENTAL TELEMETRY
- **Atmospheric Parameters**: Sustained Winds ${weather.windSpeedKmph} km/h | Precipitation ${weather.rainfallMm} mm | Barometer: ${weather.barometricPressureHpa} hPa.
- **Hydrological Inundation**: ${weather.stormSurgeMeters ? `Ocean Surge Peak at +${weather.stormSurgeMeters}m` : weather.riverLevelMeters ? `River Level at ${weather.riverLevelMeters}m` : 'Runoff localized to lowlands'}.
- **Forecast Vector**: Projected trend is **${weather.forecastTrend}** over the next 6-hour operational window.

---

### 4. FIELD EXTRACTION & LIFE-SAFETY STATUS
- **Populations in Hazard Zone**: ${population.totalAffected.toLocaleString()} citizens (${population.highRiskDemographicCount.toLocaleString()} high-risk priority).
- **Evacuation Progression**: ${population.evacuatedCount.toLocaleString()} cleared (${(population.evacuationComplianceRate * 100).toFixed(0)}% compliance rate).
- **Stranded / Isolated**: ${population.strandedCount.toLocaleString()} individuals flagged for targeted amphibious extraction.

---

### 5. LOGISTICS & CRITICAL ARTERIES
- **Primary Transit Artery**: **${clearCorridor}** (Designated Safe Route).
- **Severed Lifelines**: ${infrastructure.bridgesCollapsed} bridge collapse(s), ${infrastructure.substationsDamaged} substation(s) down.
- **Available Field Assets**: ${resources.rescueBoats.available} Watercraft, ${resources.ambulances.available} ALS Ambulances, ${resources.personnelRescueTeams.available} Specialized Extraction Squads.
- **Trauma Capacity**: ${hospitals.icuBedsAvailable} ICU Beds available across ${hospitals.totalHospitals} regional facilities.`;

    const summary = `Tactical brief for ${disaster.name}: ${threatLevel} status. ${population.evacuatedCount.toLocaleString()} cleared via ${clearCorridor}. Prioritize extraction of ${population.strandedCount.toLocaleString()} stranded citizens.`;

    const latency = Math.round(performance.now() - startTime + 45);

    return {
      id: `rep-brief-${Date.now()}`,
      type: 'OFFICER_BRIEF',
      title: `Tactical Field Briefing - ${disaster.name}`,
      content,
      summary,
      provider: 'MOCK',
      providerName: 'Expert System + Mock AI',
      mode: 'Local AI Mode',
      generatedAt: timestamp,
      generationTimeMs: latency,
      confidence,
      triggeredRulesCount: triggeredRules.length,
      version: 'v2.5-HYBRID',
      metadata: { location: disaster.location, threatScore },
    };
  }

  public async generateSituationReport(context: ReportContext): Promise<GeneratedReport> {
    const startTime = performance.now();
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
      recommendations,
      priorityActions,
      triggeredRules,
    } = context;

    const clearCorridor = roads.find((r) => r.status === 'CLEAR')?.name || 'Inland Ridge Corridor';
    const blockedRoads = roads.filter((r) => r.status === 'IMPASSABLE' || r.status === 'FLOOD_WARNING');
    const timestamp = new Date().toISOString();

    const content = `## 1. EXECUTIVE SITUATION & INCIDENT SUMMARY
The National Emergency Operations Centre (NEOC) has escalated crisis posture for **${disaster.name}** in **${disaster.location}**.
- **Incident Classification**: ${disaster.type} // Level-3 Major Emergency Declaration
- **Active Operational Threat Level**: **${threatLevel}**
- **Calculated Risk Index**: **${threatScore}/100**
- **Decision Engine Confidence**: ${(confidence * 100).toFixed(1)}% (Based on ${triggeredRules.length} firing production rules)

---

## 2. METEOROLOGICAL & HYDROLOGICAL CONDITIONS
- **Precipitation**: Recorded at **${weather.rainfallMm} mm** over the last observation cycle.
- **Sustained Winds & Gusts**: **${weather.windSpeedKmph} km/h** with tropical storm/cyclonic shear.
- **Hydrological Peaks**: ${weather.stormSurgeMeters ? `Coastal storm surge recorded at +${weather.stormSurgeMeters}m.` : 'Riverine crest approaching critical threshold.'}
- **Short-Term Trend**: Weather envelope is evaluated as **${weather.forecastTrend}**.

---

## 3. HUMAN IMPACT, DISPLACEMENT & EVACUATION
- **Total Exposed Population**: **${population.totalAffected.toLocaleString()}** individuals within a ${disaster.radiusKm} km radius.
- **Evacuated to Community Shelters**: **${population.evacuatedCount.toLocaleString()}** citizens safely relocated.
- **Vulnerable / High-Risk Dependents**: **${population.highRiskDemographicCount.toLocaleString()}** (geriatric, neonate, ventilator-dependent).
- **Stranded / Isolated Clusters**: **${population.strandedCount.toLocaleString()}** individuals requiring immediate watercraft deployment.
- **Evacuation Compliance**: Evaluated at **${(population.evacuationComplianceRate * 100).toFixed(0)}%**.

---

## 4. CRITICAL INFRASTRUCTURE & LIFELINE INTEGRITY
- **Transportation Networks**: ${infrastructure.bridgesCollapsed > 0 ? `**${infrastructure.bridgesCollapsed} critical bridge(s) severed.**` : 'No structural bridge collapses detected.'} ${blockedRoads.length} arterial roads impassable.
- **Electrical Grid**: **${infrastructure.substationsDamaged}** substations damaged; power grid operating on islanded contingency.
- **Telecommunications**: **${infrastructure.cellularTowersOffline}** cellular base stations offline; backup satellite mesh active.
- **Municipal Water & Sanitation**: ${infrastructure.waterTreatmentPlantsCompromised > 0 ? 'Water treatment facility compromised.' : 'Potable distribution intact under boil-water advisory.'}
- **Structural Damage Index**: Assessed at **${infrastructure.structuralDamagePercentage}%** within immediate impact perimeter.

---

## 5. HEALTHCARE READINESS & CASUALTY MANAGEMENT
- **Operating Trauma Centers**: **${hospitals.totalHospitals}** regional hospitals reporting.
- **ICU Headroom**: **${hospitals.icuBedsAvailable}** open adult/pediatric ICU beds remaining.
- **Surge Saturation**: Trauma wards operating at **${hospitals.traumaSurgeCapacityPercent}%** of surge threshold.
- **Auxiliary Generation**: ${hospitals.backupGeneratorsOperational ? 'Backup generators 100% operational with diesel reserves.' : 'WARNING: Primary auxiliary generators non-functional.'}
- **Medical Oxygen Reserves**: **${hospitals.medicalOxygenSupplyHours} hours** before cryogenic replenishment required.

---

## 6. LOGISTICAL INVENTORY & MOBILIZATION STATUS
- **Watercraft & Amphibious Assets**: ${resources.rescueBoats.available} deployable (${resources.rescueBoats.total} total inventory).
- **Advanced Life Support Fleet**: ${resources.ambulances.available} operational (${resources.ambulances.total} total inventory).
- **Specialist Search & Rescue**: ${resources.personnelRescueTeams.available} deployed teams on-station.
- **Ration Logistics**: ${resources.foodRationsKits.available.toLocaleString()} food rations / ${resources.potableWaterLiters.available.toLocaleString()}L drinking water available. Deficit offset requisition requested.
- **Authoritative Transit Route**: Traffic rerouted via **${clearCorridor}**.

---

## 7. EXPERT SYSTEM ACTION DIRECTIVES
${priorityActions.map((act, i) => `${i + 1}. **${act}**`).join('\n')}

---

## 8. STRATEGIC RECOMMENDATIONS
${recommendations.map((rec, i) => `### Recommendation ${i + 1}: ${rec.title}
- **Priority**: [${rec.priority}] | **Sector**: ${rec.category}
- **Operational Action**: ${rec.action}
- **Causal Reasoning**: ${rec.reasoning || 'Mitigate compounding crisis vectors.'}
- **Projected Risk Reduction**: -${rec.impactScoreReduction ?? 10} points on regional threat index.`).join('\n\n')}`;

    const summary = `National SITREP for ${disaster.name}: Threat ${threatLevel} (${threatScore}/100). ${population.totalAffected.toLocaleString()} affected, ${population.evacuatedCount.toLocaleString()} evacuated. Primary corridor: ${clearCorridor}.`;

    const latency = Math.round(performance.now() - startTime + 65);

    return {
      id: `rep-sitrep-${Date.now()}`,
      type: 'SITUATION_REPORT',
      title: `National Situation Report (SITREP) - ${disaster.name}`,
      content,
      summary,
      provider: 'MOCK',
      providerName: 'Expert System + Mock AI',
      mode: 'Local AI Mode',
      generatedAt: timestamp,
      generationTimeMs: latency,
      confidence,
      triggeredRulesCount: triggeredRules.length,
      version: 'v2.5-HYBRID',
      metadata: { location: disaster.location, threatScore },
    };
  }

  public async generateExecutiveSummary(context: ReportContext): Promise<GeneratedReport> {
    const startTime = performance.now();
    const {
      disaster,
      threatLevel,
      threatScore,
      confidence,
      population,
      infrastructure,
      hospitals,
      priorityActions,
      triggeredRules,
    } = context;

    const timestamp = new Date().toISOString();

    const content = `### STRATEGIC EXECUTIVE BRIEFING FOR MINISTERIAL LEADERSHIP

#### 1. INCIDENT THREAT CLASSIFICATION
**${disaster.name}** has reached **${threatLevel}** severity in **${disaster.location}**, with an algorithmic risk score of **${threatScore}/100**. The NEOC Artificial Intelligence Decision Support System certifies this assessment with **${(confidence * 100).toFixed(1)}% system confidence**, corroborated by **${triggeredRules.length} verified production rules**.

#### 2. HUMANITARIAN & POPULATION IMPACT
- An estimated **${population.totalAffected.toLocaleString()}** residents are currently in the hazard footprint.
- Organized civil defense measures have evacuated **${population.evacuatedCount.toLocaleString()}** individuals.
- High-priority focus is required for **${population.strandedCount.toLocaleString()}** citizens trapped by flash floodwaters or structural impediments.
- Evacuation compliance remains robust at **${(population.evacuationComplianceRate * 100).toFixed(0)}%**, with geo-targeted wireless alerts broadcasting every 15 minutes.

#### 3. GOVERNANCE & INFRASTRUCTURE INTEGRITY
- Arterial transport has experienced severe localized degradation (${infrastructure.bridgesCollapsed} bridge failures).
- Power and telecommunication lifelines remain compromised in forward quadrants (${infrastructure.substationsDamaged} substations, ${infrastructure.cellularTowersOffline} cellular stations).
- Regional medical infrastructure reports **${hospitals.icuBedsAvailable}** unoccupied ICU beds with oxygen supplies adequate for ${hospitals.medicalOxygenSupplyHours} hours.

#### 4. EXECUTIVE ACTIONS FOR CABINET ENDORSEMENT
${priorityActions.map((act, i) => `${i + 1}. **Cabinet Action ${i + 1}**: ${act}`).join('\n')}

#### 5. RECOMMENDED STRATEGIC INITIATIVES
- **Declaration of Special Emergency Measures**: Authorize emergency requisition of civilian heavy transport and private aviation assets.
- **Inter-State Mutual Aid**: Request deployment of 4 additional National Disaster Response battalions and 20 amphibious extraction units from neighboring operational commands.
- **Financial Contingency Release**: Release preliminary emergency relief grant tranches for shelter sustenance and emergency water purification plants.`;

    const summary = `Executive Briefing: ${disaster.name} designated ${threatLevel} threat. Recommend immediate cabinet sign-off on 4 strategic emergency directives and mutual-aid requisitions.`;

    const latency = Math.round(performance.now() - startTime + 50);

    return {
      id: `rep-exec-${Date.now()}`,
      type: 'EXECUTIVE_SUMMARY',
      title: `Executive Strategic Summary - ${disaster.name}`,
      content,
      summary,
      provider: 'MOCK',
      providerName: 'Expert System + Mock AI',
      mode: 'Local AI Mode',
      generatedAt: timestamp,
      generationTimeMs: latency,
      confidence,
      triggeredRulesCount: triggeredRules.length,
      version: 'v2.5-HYBRID',
      metadata: { location: disaster.location, threatScore },
    };
  }

  public async generatePublicAdvisory(context: ReportContext): Promise<GeneratedReport> {
    const startTime = performance.now();
    const { disaster, threatLevel, roads, weather } = context;
    const clearCorridor = roads.find((r) => r.status === 'CLEAR')?.name || 'Inland Ridge Corridor';
    const timestamp = new Date().toISOString();

    const content = `### CIVIL DEFENSE PUBLIC EMERGENCY ADVISORY
**Issued by the National Emergency Management Authority**  
**Target Area**: Residents of **${disaster.location}** and Surrounding Regions  
**Advisory Status**: **${threatLevel === 'CRITICAL' ? 'RED EMERGENCY DIRECTIVE' : 'URGENT AMBER WARNING'}**

---

#### WHAT IS HAPPENING
**${disaster.name}** is impacting your district with heavy rainfall (${weather.rainfallMm} mm) and powerful sustained winds (${weather.windSpeedKmph} km/h). Severe localized flooding and road blockages are actively occurring.

---

#### CRITICAL ACTIONS YOU MUST TAKE RIGHT NOW

1. **EVACUATE LOW-LYING AREAS IMMEDIATELY**:
   If you live in coastal areas, riverbanks, or poorly drained lowlands, move inland toward higher ground without delay.

2. **FOLLOW DESIGNATED SAFE ROUTES**:
   Use **${clearCorridor}**. DO NOT attempt to take coastal or river crossings. 

3. **NEVER DRIVE OR WALK THROUGH FLOODWATERS**:
   As little as 6 inches of moving water can knock you down, and 12 inches can sweep away a vehicle. Turn around; do not drown.

4. **SHELTER & ESSENTIALS**:
   Take only essential prescription medications, drinking water, identification documents, and warm clothing. Proceed to your nearest municipal community shelter.

5. **STAY INFORMED & PRESERVE PHONE BATTERY**:
   Tune portable radios to **98.4 FM** or **104.2 FM** for live official civil defense updates. Avoid streaming video on your phone to conserve battery for emergency SOS calls.

---

#### EMERGENCY HOTLINES
- **National Emergency Helpline**: **112**
- **Disaster Response & Rescue Cell**: **1070**
- **Medical & Ambulance Dispatch**: **108**

*Civil defense personnel, rescue watercraft, and medical teams are actively deployed across the sector to assist all residents.*`;

    const summary = `Public civil defense advisory for ${disaster.location}: Evacuate low-lying zones immediately via ${clearCorridor}. Dial 112 for rescue dispatch.`;

    const latency = Math.round(performance.now() - startTime + 40);

    return {
      id: `rep-public-${Date.now()}`,
      type: 'PUBLIC_ADVISORY',
      title: `Emergency Civil Protection Advisory - ${disaster.name}`,
      content,
      summary,
      provider: 'MOCK',
      providerName: 'Expert System + Mock AI',
      mode: 'Local AI Mode',
      generatedAt: timestamp,
      generationTimeMs: latency,
      confidence: context.confidence,
      triggeredRulesCount: context.triggeredRules.length,
      version: 'v2.5-HYBRID',
      metadata: { location: disaster.location },
    };
  }
}
