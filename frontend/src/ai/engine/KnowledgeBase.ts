import { AIRule, RuleCategory } from '../types';
import { WorldState } from '../core/WorldState';

export class KnowledgeBase {
  private rules: Map<string, AIRule> = new Map();

  constructor(initialRules?: AIRule[]) {
    if (initialRules && initialRules.length > 0) {
      this.addRules(initialRules);
    } else {
      this.loadExpertDisasterRules();
    }
  }

  public addRule(rule: AIRule): void {
    this.rules.set(rule.id, rule);
  }

  public addRules(rules: AIRule[]): void {
    rules.forEach((rule) => this.addRule(rule));
  }

  public removeRule(ruleId: string): boolean {
    return this.rules.delete(ruleId);
  }

  public getRule(ruleId: string): AIRule | undefined {
    return this.rules.get(ruleId);
  }

  public getAllRules(): AIRule[] {
    return Array.from(this.rules.values());
  }

  public getRulesByCategory(category: RuleCategory): AIRule[] {
    return this.getAllRules().filter((r) => r.category === category);
  }

  public clear(): void {
    this.rules.clear();
  }

  /**
   * Loads 32 professional, domain-verified disaster management rules with human-readable XAI explanations.
   */
  public loadExpertDisasterRules(): void {
    const rules: AIRule[] = [
      // ==================== FLOOD RULES ====================
      {
        id: 'RULE_FLOOD_01',
        title: 'Riverine Stage Overflow & Flash Inundation',
        description: 'Triggers when cumulative rainfall exceeds 150mm and river stage exceeds official flood warning threshold.',
        category: 'FLOOD',
        priorityWeight: 95,
        priority: 'CRITICAL',
        condition: (s: WorldState) =>
          s.weather.rainfallMm >= 150 &&
          (s.weather.riverLevelMeters ?? 0) >= (s.weather.riverFloodStageMeters ?? 5.0),
        action: {
          recommendationTitle: 'Execute Sector-Wide Riverine Flood Inundation Clearance',
          recommendationCategory: 'EVACUATION',
          action: 'Order mandatory evacuation of all residential settlements situated within 2 km of river banks.',
          impactScoreReduction: 26,
          priority: 'IMMEDIATE',
          directives: ['Activate flood sirens in riparian sectors', 'Deploy evacuation flat-bottom boats'],
        },
        explanation: 'Heavy precipitation has pushed the main river water level beyond the 5.0m threshold, guaranteeing rapid downstream levee overtopping.',
        confidence: 0.96,
      },
      {
        id: 'RULE_FLOOD_02',
        title: 'Urban Water Ingress Exceeding Vehicular Clearance',
        description: 'Fired when monitored road water depth exceeds 0.5m, making standard vehicular evacuation fatal.',
        category: 'FLOOD',
        priorityWeight: 88,
        priority: 'HIGH',
        condition: (s: WorldState) =>
          s.roads.some((r) => (r.waterDepthMeters ?? 0) >= 0.5 && r.status !== 'IMPASSABLE'),
        action: {
          recommendationTitle: 'Impose Immediate Low-Clearance Vehicle Ban',
          recommendationCategory: 'INFRASTRUCTURE',
          action: 'Bar standard civil vehicles from entering low-lying road networks; permit only high-clearance military transports.',
          impactScoreReduction: 18,
          priority: 'HIGH_PRIORITY',
          directives: ['Erect physical barricades at submersion points', 'Broadcast warning to turn around, dont drown'],
        },
        explanation: 'Water depth on municipal corridors exceeds 0.5m, creating severe hydro-planing and engine flooding hazards.',
        confidence: 0.94,
      },
      {
        id: 'RULE_FLOOD_03',
        title: 'Critical Flood Protection Embankment Breach',
        description: 'Triggers when one or more flood retention embankments have suffered physical structural failure.',
        category: 'FLOOD',
        priorityWeight: 98,
        priority: 'CRITICAL',
        condition: (s: WorldState) => s.infrastructure.criticalEmbankmentsBreached > 0,
        action: {
          recommendationTitle: 'Dispatch Emergency Geosynthetic Sandbagging & Secondary Wall Defense',
          recommendationCategory: 'INFRASTRUCTURE',
          action: 'Airdrop heavy aggregate barriers and mobilize combat engineering regiments to reinforce breached flood bunds.',
          impactScoreReduction: 28,
          priority: 'IMMEDIATE',
          directives: ['Deploy army engineering corps', 'Execute immediate zero-notice downstream evacuation'],
        },
        explanation: 'A critical embankment wall has ruptured, unleashing an uncontrolled wall of water toward downstream residential wards.',
        confidence: 0.98,
      },

      // ==================== CYCLONE RULES ====================
      {
        id: 'RULE_CYCLONE_01',
        title: 'Category 4 Extreme Gale Force Winds',
        description: 'Detects sustained or gusting cyclonic winds exceeding 130 km/h capable of severe roof and utility destruction.',
        category: 'CYCLONE',
        priorityWeight: 96,
        priority: 'CRITICAL',
        condition: (s: WorldState) => s.weather.windSpeedKmph >= 130,
        action: {
          recommendationTitle: 'Declare Complete Outdoor Curfew & Cyclone Shelter Lockdown',
          recommendationCategory: 'EVACUATION',
          action: 'Mandate immediate shelter-in-place inside reinforced masonry buildings and seal all cyclonic shelter blast doors.',
          impactScoreReduction: 25,
          priority: 'IMMEDIATE',
          directives: ['Ground all emergency flight operations', 'Enforce mandatory curfew on open roads'],
        },
        explanation: 'Wind speeds exceeding 130 km/h transform loose debris into lethal ballistic projectiles and destroy unreinforced roofs.',
        confidence: 0.97,
      },
      {
        id: 'RULE_CYCLONE_02',
        title: 'Lethal Coastal Storm Surge Inundation',
        description: 'Fired when cyclonic ocean storm surge projections exceed 2.5 meters above astronomical high tide.',
        category: 'CYCLONE',
        priorityWeight: 97,
        priority: 'CRITICAL',
        condition: (s: WorldState) => (s.weather.stormSurgeMeters ?? 0) >= 2.5,
        action: {
          recommendationTitle: 'Total Coastal Zone Clearance Ahead of Surge Wall',
          recommendationCategory: 'EVACUATION',
          action: 'Execute mandatory total clearance of all barrier islands and coastal villages within 5 km of shoreline.',
          impactScoreReduction: 30,
          priority: 'IMMEDIATE',
          directives: ['Mobilize coastal bus fleets', 'Establish elevated receiving camps inland'],
        },
        explanation: 'Storm surge crest above 2.5m will completely submerge coastal protection structures and isolate coastal strips.',
        confidence: 0.98,
      },
      {
        id: 'RULE_CYCLONE_03',
        title: 'Severe Barometric Drop Indicating Explosive Cyclogenesis',
        description: 'Barometric pressure plummeting below 960 hPa signals a deepening cyclonic core nearing landfall.',
        category: 'CYCLONE',
        priorityWeight: 87,
        priority: 'HIGH',
        condition: (s: WorldState) => s.weather.barometricPressureHpa < 960,
        action: {
          recommendationTitle: 'Pre-Stage Search and Rescue Behind Anticipated Impact Zone',
          recommendationCategory: 'RESOURCES',
          action: 'Position disaster recovery battalions at high-elevation bases outside the direct eye wall path.',
          impactScoreReduction: 16,
          priority: 'HIGH_PRIORITY',
        },
        explanation: 'Atmospheric pressure below 960 hPa indicates severe eyewall wind intensification within 6 hours.',
        confidence: 0.92,
      },

      // ==================== WILDFIRE RULES ====================
      {
        id: 'RULE_WILDFIRE_01',
        title: 'Extreme Fire Weather Condition (Red Flag Formula)',
        description: 'Triggers when ambient temperature exceeds 35°C, humidity drops below 20%, and winds exceed 40 km/h.',
        category: 'WILDFIRE',
        priorityWeight: 93,
        priority: 'CRITICAL',
        condition: (s: WorldState) =>
          s.weather.temperatureCelsius >= 35 &&
          s.weather.humidityPercent <= 20 &&
          s.weather.windSpeedKmph >= 40,
        action: {
          recommendationTitle: 'Activate Wildfire Urban Interface Firebreak Creation',
          recommendationCategory: 'INFRASTRUCTURE',
          action: 'Deploy bulldozers and aerial retardant tankers to carve 50-meter firebreaks along suburban edges.',
          impactScoreReduction: 24,
          priority: 'IMMEDIATE',
        },
        explanation: 'Combination of high heat, bone-dry humidity, and brisk wind creates erratic fire crowning and rapid ember spotting.',
        confidence: 0.95,
      },
      {
        id: 'RULE_WILDFIRE_02',
        title: 'Hazardous Atmospheric Particulate Smoke Inversion',
        description: 'Triggers when Air Quality Index (AQI) exceeds 300, posing severe acute respiratory risk.',
        category: 'WILDFIRE',
        priorityWeight: 82,
        priority: 'HIGH',
        condition: (s: WorldState) => (s.weather.airQualityIndex ?? 0) >= 300,
        action: {
          recommendationTitle: 'Distribute N95/P100 Masks & Establish Clean Air Sanctuaries',
          recommendationCategory: 'MEDICAL',
          action: 'Distribute 50,000 particulate respirators and activate air-filtered community centers.',
          impactScoreReduction: 14,
          priority: 'HIGH_PRIORITY',
        },
        explanation: 'Wildfire PM2.5 concentrations exceeding AQI 300 cause acute pulmonary distress in pediatric and elderly populations.',
        confidence: 0.91,
      },

      // ==================== EARTHQUAKE RULES ====================
      {
        id: 'RULE_EARTHQUAKE_01',
        title: 'Catastrophic Structural Building Collapse',
        description: 'Triggers when structural damage rate across the urban district exceeds 25%.',
        category: 'EARTHQUAKE',
        priorityWeight: 98,
        priority: 'CRITICAL',
        condition: (s: WorldState) => s.infrastructure.structuralDamagePercentage >= 25,
        action: {
          recommendationTitle: 'Deploy Heavy Urban Search and Rescue (USAR) & K-9 Teams',
          recommendationCategory: 'RESOURCES',
          action: 'Direct specialized acoustic listening and canine search teams into collapsed multi-story buildings.',
          impactScoreReduction: 32,
          priority: 'IMMEDIATE',
        },
        explanation: 'Structural damage exceeding 25% creates void entrapments where survival rates decay exponentially after the first 24 hours.',
        confidence: 0.98,
      },
      {
        id: 'RULE_EARTHQUAKE_02',
        title: 'Post-Seismic Gas & Electrical Fire Risk Mitigation',
        description: 'Triggers when major structural damage occurs, mandating regional utility cut-offs to stop secondary conflagrations.',
        category: 'EARTHQUAKE',
        priorityWeight: 89,
        priority: 'HIGH',
        condition: (s: WorldState) => s.currentDisaster.type === 'EARTHQUAKE' && s.infrastructure.substationsDamaged > 0,
        action: {
          recommendationTitle: 'Trigger Remote Grid Isolation & Municipal Gas Main Shutoff',
          recommendationCategory: 'INFRASTRUCTURE',
          action: 'Isolate compromised electrical circuits and vent underground gas pipelines in damaged grids.',
          impactScoreReduction: 20,
          priority: 'HIGH_PRIORITY',
        },
        explanation: 'Broken natural gas lines and severed energized electrical cables cause secondary catastrophic city-wide fires following seismic events.',
        confidence: 0.94,
      },

      // ==================== INFRASTRUCTURE RULES ====================
      {
        id: 'RULE_INFRA_01',
        title: 'Critical Evacuation Bridge Span Collapse',
        description: 'Triggers when one or more bridges have collapsed, severing primary evacuation routes.',
        category: 'INFRASTRUCTURE',
        priorityWeight: 97,
        priority: 'CRITICAL',
        condition: (s: WorldState) => s.infrastructure.bridgesCollapsed > 0,
        action: {
          recommendationTitle: 'Erect Military Bailey Bridge & Reroute To Inland Axis',
          recommendationCategory: 'INFRASTRUCTURE',
          action: 'Deploy military bridging engineers to deploy pontoon spans and immediately redirect traffic away from severed crossing.',
          impactScoreReduction: 24,
          priority: 'IMMEDIATE',
        },
        explanation: 'Collapsed bridges trap evacuation columns and block emergency heavy apparatus from reaching disaster grounds.',
        confidence: 0.98,
      },
      {
        id: 'RULE_INFRA_02',
        title: 'Regional Power Substation Failure',
        description: 'Triggers when 2 or more electrical distribution substations are damaged.',
        category: 'INFRASTRUCTURE',
        priorityWeight: 84,
        priority: 'HIGH',
        condition: (s: WorldState) => s.infrastructure.substationsDamaged >= 2,
        action: {
          recommendationTitle: 'Mobilize Mobile Industrial Generators for Critical Lifeline Facilities',
          recommendationCategory: 'RESOURCES',
          action: 'Deliver 500kVA mobile diesel generators to water treatment plants and cold-chain medical warehouses.',
          impactScoreReduction: 16,
          priority: 'HIGH_PRIORITY',
        },
        explanation: 'Loss of two or more regional power substations induces cascade failures in water pumping and municipal communications.',
        confidence: 0.92,
      },
      {
        id: 'RULE_INFRA_03',
        title: 'Cellular Telecommunication Grid Blackout',
        description: 'Triggers when 3 or more cellular relay towers go offline, cutting civilian call-for-help capability.',
        category: 'INFRASTRUCTURE',
        priorityWeight: 86,
        priority: 'HIGH',
        condition: (s: WorldState) => s.infrastructure.cellularTowersOffline >= 3,
        action: {
          recommendationTitle: 'Deploy Satellite Cellular-on-Wheels (COW) & Mesh Radios',
          recommendationCategory: 'COMMUNICATION',
          action: 'Dispatch emergency mobile telecom trailers and enable VHF/UHF tactical radio repeaters.',
          impactScoreReduction: 15,
          priority: 'HIGH_PRIORITY',
        },
        explanation: 'Loss of mobile towers blinds citizens from emergency broadcasts and prevents rescue dispatch triage.',
        confidence: 0.93,
      },
      {
        id: 'RULE_INFRA_04',
        title: 'Potable Water Treatment Plant Inundation',
        description: 'Triggers when municipal water processing stations are physically compromised.',
        category: 'INFRASTRUCTURE',
        priorityWeight: 85,
        priority: 'HIGH',
        condition: (s: WorldState) => s.infrastructure.waterTreatmentPlantsCompromised > 0,
        action: {
          recommendationTitle: 'Issue Boil Water Mandate & Position Mobile Desalination Skids',
          recommendationCategory: 'SUPPLY_CHAIN',
          action: 'Broadcast immediate boil-water notices and stage reverse-osmosis purification units.',
          impactScoreReduction: 17,
          priority: 'HIGH_PRIORITY',
        },
        explanation: 'Compromised water treatment facilities allow pathogen intrusion into drinking mains, risking waterborne disease epidemics.',
        confidence: 0.95,
      },

      // ==================== MEDICAL RULES ====================
      {
        id: 'RULE_MEDICAL_01',
        title: 'Regional Hospital ICU Bed Saturation',
        description: 'Triggers when available ICU capacity falls to 5 beds or fewer across all hospitals.',
        category: 'MEDICAL',
        priorityWeight: 96,
        priority: 'CRITICAL',
        condition: (s: WorldState) => s.hospitals.icuBedsAvailable <= 5,
        action: {
          recommendationTitle: 'Airlift Critical Patients to Secondary Regional Centers',
          recommendationCategory: 'MEDICAL',
          action: 'Request rotary aeromedical transport to evacuate unstable ICU patients to non-impacted tertiary hospitals.',
          impactScoreReduction: 22,
          priority: 'IMMEDIATE',
        },
        explanation: 'Severe ICU bed depletion means newly triaged trauma patients cannot receive life support care without immediate air medevac.',
        confidence: 0.97,
      },
      {
        id: 'RULE_MEDICAL_02',
        title: 'Hospital Emergency Power Disruption Risk',
        description: 'Triggers when hospital backup generators fail during an external power blackout.',
        category: 'MEDICAL',
        priorityWeight: 99,
        priority: 'CRITICAL',
        condition: (s: WorldState) => !s.hospitals.backupGeneratorsOperational,
        action: {
          recommendationTitle: 'Emergency Priority Power Restoration & Generator Air-Delivery',
          recommendationCategory: 'RESOURCES',
          action: 'Airlift emergency containerized generators directly to hospital helipads within 60 minutes.',
          impactScoreReduction: 35,
          priority: 'IMMEDIATE',
        },
        explanation: 'Hospitals without operational backup generators lose ventilators, operating theaters, and infant incubators.',
        confidence: 0.99,
      },
      {
        id: 'RULE_MEDICAL_03',
        title: 'Critical Medical Oxygen Depletion (< 24 Hours)',
        description: 'Triggers when regional hospitals have less than 24 hours of medical oxygen reserves remaining.',
        category: 'MEDICAL',
        priorityWeight: 94,
        priority: 'CRITICAL',
        condition: (s: WorldState) => s.hospitals.medicalOxygenSupplyHours < 24,
        action: {
          recommendationTitle: 'Dispatch High-Priority Cryogenic Liquid Oxygen Convoy',
          recommendationCategory: 'SUPPLY_CHAIN',
          action: 'Provide state police escort for cryogenic liquid oxygen tankers along priority express corridors.',
          impactScoreReduction: 21,
          priority: 'IMMEDIATE',
        },
        explanation: 'Liquid oxygen supplies below 24 hours create catastrophic mortality risk for intensive care patients.',
        confidence: 0.96,
      },

      // ==================== EVACUATION RULES ====================
      {
        id: 'RULE_EVAC_01',
        title: 'High Population Density Inundation Zone Evacuation',
        description: 'Triggers when population density exceeds 2000/sq km in a designated high-threat disaster zone.',
        category: 'EVACUATION',
        priorityWeight: 94,
        priority: 'CRITICAL',
        condition: (s: WorldState) =>
          s.population.densityPerSqKm >= 2000 &&
          (s.currentRiskLevel === 'CRITICAL' || s.threatScore >= 80),
        action: {
          recommendationTitle: 'Deploy Staged High-Volume Mass Transit Evacuation Fleet',
          recommendationCategory: 'EVACUATION',
          action: 'Mobilize 120 municipal buses and passenger ferries to clear high-density residential grids in 30-minute cycles.',
          impactScoreReduction: 27,
          priority: 'IMMEDIATE',
        },
        explanation: 'Extremely high population density in a severe hazard footprint guarantees catastrophic casualties unless mass transit is deployed immediately.',
        confidence: 0.97,
      },
      {
        id: 'RULE_EVAC_02',
        title: 'Vulnerable Demographic Rescue Prioritization',
        description: 'Triggers when over 500 vulnerable individuals (elderly, infants, mobility impaired) remain stranded.',
        category: 'EVACUATION',
        priorityWeight: 92,
        priority: 'CRITICAL',
        condition: (s: WorldState) => s.population.highRiskDemographicCount > 500 && s.population.strandedCount > 200,
        action: {
          recommendationTitle: 'Prioritize Assisted Care & Dialysis Patient Door-to-Door Extraction',
          recommendationCategory: 'EVACUATION',
          action: 'Dispatch paramedical rescue squads with stair chairs and oxygen bags to evacuate assisted care centers.',
          impactScoreReduction: 23,
          priority: 'IMMEDIATE',
        },
        explanation: 'Non-ambulatory citizens cannot self-evacuate and face fatal hypothermia or dehydration if not directly assisted.',
        confidence: 0.95,
      },
      {
        id: 'RULE_EVAC_03',
        title: 'Primary Evacuation Corridor Complete Severance',
        description: 'Triggers when the designated primary evacuation corridor is closed or blocked.',
        category: 'EVACUATION',
        priorityWeight: 96,
        priority: 'CRITICAL',
        condition: (s: WorldState) =>
          s.roads.some((r) => r.isPrimaryEvacuationCorridor && r.status === 'IMPASSABLE'),
        action: {
          recommendationTitle: 'Activate Secondary Arterial Evacuation By-Pass Plan',
          recommendationCategory: 'INFRASTRUCTURE',
          action: 'Activate counter-flow on secondary inland expressway and redirect all law enforcement traffic directors.',
          impactScoreReduction: 26,
          priority: 'IMMEDIATE',
        },
        explanation: 'Blockage of the primary lifeline highway causes massive vehicle pileups and traps fleeing civilian convoys in the strike zone.',
        confidence: 0.97,
      },
      {
        id: 'RULE_EVAC_04',
        title: 'Low Evacuation Compliance Alert (< 50%)',
        description: 'Triggers when fewer than 50% of targeted citizens have adhered to evacuation directives.',
        category: 'EVACUATION',
        priorityWeight: 82,
        priority: 'HIGH',
        condition: (s: WorldState) => s.population.evacuationComplianceRate < 0.5,
        action: {
          recommendationTitle: 'Escalate to Mandatory Law Enforcement Loudspeaker Patrols',
          recommendationCategory: 'COMMUNICATION',
          action: 'Deploy emergency vehicles with vehicle-mounted loudspeakers and bilingual door knockers.',
          impactScoreReduction: 15,
          priority: 'HIGH_PRIORITY',
        },
        explanation: 'Low evacuation compliance indicates public complacency or notification failure; aggressive acoustic alerting is mandatory.',
        confidence: 0.90,
      },

      // ==================== RESOURCES & SUPPLY CHAIN ====================
      {
        id: 'RULE_RESOURCES_01',
        title: 'Critical Rescue Boat Deficit in Waterlogged Zones',
        description: 'Triggers when available rescue boats are fewer than 5 while over 200 persons remain stranded.',
        category: 'RESOURCES',
        priorityWeight: 91,
        priority: 'CRITICAL',
        condition: (s: WorldState) =>
          s.resources.rescueBoats.available < 5 && s.population.strandedCount >= 200,
        action: {
          recommendationTitle: 'Requisition Coast Guard & Civilian Flotilla Assets',
          recommendationCategory: 'RESOURCES',
          action: 'Requisition 25 motorized rigid-inflatable boats from maritime clubs and neighboring coast guard stations.',
          impactScoreReduction: 22,
          priority: 'IMMEDIATE',
        },
        explanation: 'Severe shortage of aquatic craft leaves trapped civilians on rooftops unable to be reached before nightfall.',
        confidence: 0.94,
      },
      {
        id: 'RULE_RESOURCES_02',
        title: 'Severe Potable Water Shortage Deficit (> 30%)',
        description: 'Triggers when available potable water is more than 30% below survival baseline demand.',
        category: 'RESOURCES',
        priorityWeight: 87,
        priority: 'HIGH',
        condition: (s: WorldState) =>
          s.resources.potableWaterLiters.available < s.resources.potableWaterLiters.required * 0.7,
        action: {
          recommendationTitle: 'Deploy Strategic Mobile Water Tankers & Chlorine Bladders',
          recommendationCategory: 'SUPPLY_CHAIN',
          action: 'Dispatch 10 military water bowsers and distribute 50,000 personal water purification tablets.',
          impactScoreReduction: 18,
          priority: 'HIGH_PRIORITY',
        },
        explanation: 'Water reserves below 70% threshold cause rapid dehydration and force consumption of contaminated floodwaters.',
        confidence: 0.93,
      },
      {
        id: 'RULE_RESOURCES_03',
        title: 'Emergency Food Ration Stockout Approaching',
        description: 'Triggers when available shelf-stable meal kits fall below 60% of required survival ration.',
        category: 'RESOURCES',
        priorityWeight: 83,
        priority: 'HIGH',
        condition: (s: WorldState) =>
          s.resources.foodRationsKits.available < s.resources.foodRationsKits.required * 0.6,
        action: {
          recommendationTitle: 'Airdrop Ready-to-Eat (MRE) Rations into Isolated Pockets',
          recommendationCategory: 'SUPPLY_CHAIN',
          action: 'Contract rotary helicopter sorties to airdrop 20,000 high-calorie meal packs to cut-off enclaves.',
          impactScoreReduction: 15,
          priority: 'HIGH_PRIORITY',
        },
        explanation: 'Food ration deficits compromise civilian morale and physical endurance in cut-off communities.',
        confidence: 0.91,
      },
      {
        id: 'RULE_RESOURCES_04',
        title: 'Emergency Shelters Exceeding Safety Capacity (> 90%)',
        description: 'Triggers when shelter occupancy exceeds 90% of certified structural limit.',
        category: 'RESOURCES',
        priorityWeight: 88,
        priority: 'HIGH',
        condition: (s: WorldState) =>
          s.shelters.currentOccupancy >= s.shelters.totalCapacity * 0.9,
        action: {
          recommendationTitle: 'Requisition Public Universities & Stadiums as Secondary Shelters',
          recommendationCategory: 'RESOURCES',
          action: 'Requisition indoor sports arenas and university halls to absorb shelter overflow.',
          impactScoreReduction: 19,
          priority: 'HIGH_PRIORITY',
        },
        explanation: 'Overcrowded shelters rapidly breed infectious disease outbreaks and overwhelm sanitation facilities.',
        confidence: 0.93,
      },
      {
        id: 'RULE_RESOURCES_05',
        title: 'Emergency Ambulance Fleet Exhaustion',
        description: 'Triggers when available ambulances drop to 3 or fewer during ongoing casualties.',
        category: 'RESOURCES',
        priorityWeight: 92,
        priority: 'CRITICAL',
        condition: (s: WorldState) => s.resources.ambulances.available <= 3,
        action: {
          recommendationTitle: 'Convert Transit Vans into Temporary Medical Transfer Units',
          recommendationCategory: 'RESOURCES',
          action: 'Retrofit transit vans with stretchers and basic trauma supplies to handle stable patient transports.',
          impactScoreReduction: 20,
          priority: 'IMMEDIATE',
        },
        explanation: 'Ambulance fleet exhaustion creates delays in trauma transfers, turning survivable injuries into fatalities.',
        confidence: 0.95,
      },

      // ==================== TRAFFIC & LOGISTICS ====================
      {
        id: 'RULE_TRAFFIC_01',
        title: 'Severe Arterial Gridlock on Escape Corridors',
        description: 'Triggers when evacuation routes experience critical gridlock with speeds below 15 km/h.',
        category: 'TRAFFIC',
        priorityWeight: 89,
        priority: 'HIGH',
        condition: (s: WorldState) =>
          s.traffic.gridlockOnEvacuationRoutes ||
          (s.traffic.overallCongestionLevel === 'CRITICAL' && s.traffic.averageSpeedKmph < 15),
        action: {
          recommendationTitle: 'Implement Contraflow Lane Reversal (All Lanes Outbound)',
          recommendationCategory: 'INFRASTRUCTURE',
          action: 'Reverse inbound highway lanes to double outbound evacuation capacity and station tow trucks at key junctions.',
          impactScoreReduction: 21,
          priority: 'HIGH_PRIORITY',
        },
        explanation: 'Gridlock on outward corridors traps thousands of motor vehicles in the path of the encroaching disaster front.',
        confidence: 0.94,
      },
      {
        id: 'RULE_TRAFFIC_02',
        title: 'Rescue Convoy Chokepoints Identified',
        description: 'Triggers when chokepoints throttle logistics convoys entering disaster zones.',
        category: 'TRAFFIC',
        priorityWeight: 84,
        priority: 'HIGH',
        condition: (s: WorldState) => s.traffic.chokepointsIdentified.length >= 2,
        action: {
          recommendationTitle: 'Deploy Traffic Control Officers to Enforce Dedicated Emergency Blue Lanes',
          recommendationCategory: 'INFRASTRUCTURE',
          action: 'Clear emergency shoulder lanes exclusively for ambulances, fire engines, and supply trucks.',
          impactScoreReduction: 16,
          priority: 'HIGH_PRIORITY',
        },
        explanation: 'Bottlenecks prevent essential food, fuel, and medical resupply convoys from reaching forward incident bases.',
        confidence: 0.92,
      },

      // ==================== WEATHER & INTENSITY ====================
      {
        id: 'RULE_WEATHER_01',
        title: 'Rapid Atmospheric Deterioration Forecast',
        description: 'Triggers when forecast trend indicates acute deterioration over the upcoming 6-hour window.',
        category: 'WEATHER',
        priorityWeight: 81,
        priority: 'HIGH',
        condition: (s: WorldState) => s.weather.forecastTrend === 'DETERIORATING',
        action: {
          recommendationTitle: 'Accelerate Pre-Landfall Evacuation Cut-Off Timelines',
          recommendationCategory: 'WEATHER',
          action: 'Advance mandatory shelter timelines by 2 hours ahead of deteriorating storm conditions.',
          impactScoreReduction: 14,
          priority: 'HIGH_PRIORITY',
        },
        explanation: 'Deteriorating forecast models indicate an earlier window of high vulnerability than previously calculated.',
        confidence: 0.90,
      },
      {
        id: 'RULE_WEATHER_02',
        title: 'Torrential Precipitation Exceeding 200mm Threshold',
        description: 'Triggers when rainfall exceeds 200mm, inducing catastrophic flash floods and landslides.',
        category: 'WEATHER',
        priorityWeight: 94,
        priority: 'CRITICAL',
        condition: (s: WorldState) => s.weather.rainfallMm >= 200,
        action: {
          recommendationTitle: 'Declare High Slope Landslide & Mudflow Warning',
          recommendationCategory: 'EVACUATION',
          action: 'Issue emergency clearance orders for all settlements located beneath steep hill slopes and drainage funnels.',
          impactScoreReduction: 25,
          priority: 'IMMEDIATE',
        },
        explanation: 'Extreme rainfall exceeding 200mm saturates soil profiles, triggering high-velocity debris flows and hillside failure.',
        confidence: 0.96,
      },

      // ==================== HAZMAT & INDUSTRIAL ====================
      {
        id: 'RULE_HAZMAT_01',
        title: 'Toxic Industrial Chemical Vapor Plume Release',
        description: 'Triggers during an industrial accident involving hazardous vapor or chemical spills.',
        category: 'HAZMAT',
        priorityWeight: 98,
        priority: 'CRITICAL',
        condition: (s: WorldState) => s.currentDisaster.type === 'INDUSTRIAL_ACCIDENT',
        action: {
          recommendationTitle: 'Establish 3km Downwind Hot Zone Exclusion & Decontamination Corridor',
          recommendationCategory: 'EVACUATION',
          action: 'Evacuate all civilians downwind of the chemical release point and deploy specialized hazmat scrubbers.',
          impactScoreReduction: 30,
          priority: 'IMMEDIATE',
        },
        explanation: 'Airborne toxic vapor plumes spread downwind rapidly, producing acute chemical inhalation toxicity within minutes.',
        confidence: 0.98,
      },
      {
        id: 'RULE_HAZMAT_02',
        title: 'Hazardous Vapor Plume Threatening Dense Habitation',
        description: 'Triggers when hazardous smoke or chemical fumes threaten high-density population clusters.',
        category: 'HAZMAT',
        priorityWeight: 97,
        priority: 'CRITICAL',
        condition: (s: WorldState) =>
          (s.currentDisaster.type === 'INDUSTRIAL_ACCIDENT' || s.currentDisaster.type === 'URBAN_FIRE') &&
          s.population.densityPerSqKm >= 1500,
        action: {
          recommendationTitle: 'Issue Immediate Wet-Cloth Airway Protection & Cross-Wind Evacuation',
          recommendationCategory: 'COMMUNICATION',
          action: 'Broadcast urgent instructions to evacuate perpendicular to wind direction or seal building air intakes.',
          impactScoreReduction: 28,
          priority: 'IMMEDIATE',
        },
        explanation: 'High population density in toxic plume zones requires perpendicular egress to escape the lethal concentration corridor.',
        confidence: 0.97,
      },
    ];

    this.addRules(rules);
  }
}
