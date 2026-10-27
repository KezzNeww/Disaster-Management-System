export interface HourlyRiskTrendPoint {
  time: string;
  cycloneRisk: number;
  floodRisk: number;
  compositeIndex: number;
  threshold: number;
}

export interface ResourceUsagePoint {
  category: string;
  allocated: number;
  available: number;
  capacity: number;
}

export interface DisasterDistributionPoint {
  name: string;
  value: number;
  count: number;
  fill: string;
}

export interface ResponseTimePoint {
  day: string;
  avgTimeMinutes: number;
  targetMinutes: number;
  urbanAvg: number;
  ruralAvg: number;
}

export interface MonthlyDisasterTrendPoint {
  month: string;
  floods: number;
  cyclones: number;
  earthquakes: number;
  fires: number;
  totalEvents: number;
  populationAffectedK: number;
}

export interface DistrictResponseLatencyPoint {
  district: string;
  responseMinutes: number;
  evacuatedPercentage: number;
  teamsDeployed: number;
}

export const mockDashboardCharts = {
  // Risk Trend Line Chart (24h)
  riskTrend: [
    { time: '00:00', cycloneRisk: 62, floodRisk: 48, compositeIndex: 58, threshold: 75 },
    { time: '03:00', cycloneRisk: 68, floodRisk: 52, compositeIndex: 62, threshold: 75 },
    { time: '06:00', cycloneRisk: 74, floodRisk: 61, compositeIndex: 70, threshold: 75 },
    { time: '09:00', cycloneRisk: 82, floodRisk: 75, compositeIndex: 80, threshold: 75 },
    { time: '12:00', cycloneRisk: 91, floodRisk: 84, compositeIndex: 88, threshold: 75 },
    { time: '15:00', cycloneRisk: 94, floodRisk: 89, compositeIndex: 92, threshold: 75 },
    { time: '18:00 (Est)', cycloneRisk: 96, floodRisk: 85, compositeIndex: 93, threshold: 75 },
    { time: '21:00 (Est)', cycloneRisk: 88, floodRisk: 78, compositeIndex: 84, threshold: 75 },
    { time: '24:00 (Est)', cycloneRisk: 76, floodRisk: 70, compositeIndex: 74, threshold: 75 },
  ] as HourlyRiskTrendPoint[],

  // Resource Usage Bar Chart
  resourceUsage: [
    { category: 'Ration Kits', allocated: 112, available: 38, capacity: 150 },
    { category: 'Water (kL)', allocated: 268, available: 52, capacity: 320 },
    { category: 'Trauma Kits', allocated: 62, available: 23, capacity: 85 },
    { category: 'Ambulances', allocated: 37, available: 5, capacity: 42 },
    { category: 'Helicopters', allocated: 39, available: 9, capacity: 48 },
    { category: 'Shelter Hubs', allocated: 48, available: 17, capacity: 65 },
  ] as ResourceUsagePoint[],

  // Disaster Distribution Pie Chart
  disasterDistribution: [
    { name: 'Floods', value: 45, count: 9, fill: '#38BDF8' }, // sky-400
    { name: 'Cyclones', value: 25, count: 5, fill: '#2563EB' }, // blue-600
    { name: 'Earthquakes', value: 18, count: 4, fill: '#F59E0B' }, // amber-500
    { name: 'Wildfires', value: 12, count: 2, fill: '#EF4444' }, // red-500
  ] as DisasterDistributionPoint[],

  // Response Time Area Chart
  responseTime: [
    { day: 'Mon', avgTimeMinutes: 28, targetMinutes: 20, urbanAvg: 18, ruralAvg: 38 },
    { day: 'Tue', avgTimeMinutes: 24, targetMinutes: 20, urbanAvg: 16, ruralAvg: 32 },
    { day: 'Wed', avgTimeMinutes: 32, targetMinutes: 20, urbanAvg: 22, ruralAvg: 42 },
    { day: 'Thu', avgTimeMinutes: 19, targetMinutes: 20, urbanAvg: 14, ruralAvg: 24 },
    { day: 'Fri', avgTimeMinutes: 22, targetMinutes: 20, urbanAvg: 15, ruralAvg: 29 },
    { day: 'Sat', avgTimeMinutes: 17, targetMinutes: 20, urbanAvg: 12, ruralAvg: 22 },
    { day: 'Sun (Today)', avgTimeMinutes: 15, targetMinutes: 20, urbanAvg: 11, ruralAvg: 19 },
  ] as ResponseTimePoint[],
};

export const mockAnalyticsData = {
  // Monthly Historical Disasters (12 months)
  monthlyTrends: [
    { month: 'Nov 25', floods: 4, cyclones: 2, earthquakes: 1, fires: 1, totalEvents: 8, populationAffectedK: 410 },
    { month: 'Dec 25', floods: 2, cyclones: 1, earthquakes: 2, fires: 0, totalEvents: 5, populationAffectedK: 280 },
    { month: 'Jan 26', floods: 1, cyclones: 0, earthquakes: 3, fires: 2, totalEvents: 6, populationAffectedK: 190 },
    { month: 'Feb 26', floods: 1, cyclones: 0, earthquakes: 1, fires: 4, totalEvents: 6, populationAffectedK: 210 },
    { month: 'Mar 26', floods: 2, cyclones: 1, earthquakes: 1, fires: 6, totalEvents: 10, populationAffectedK: 350 },
    { month: 'Apr 26', floods: 3, cyclones: 2, earthquakes: 2, fires: 7, totalEvents: 14, populationAffectedK: 520 },
    { month: 'May 26', floods: 6, cyclones: 4, earthquakes: 1, fires: 5, totalEvents: 16, populationAffectedK: 890 },
    { month: 'Jun 26', floods: 9, cyclones: 3, earthquakes: 2, fires: 3, totalEvents: 17, populationAffectedK: 1240 },
    { month: 'Jul 26', floods: 14, cyclones: 5, earthquakes: 1, fires: 1, totalEvents: 21, populationAffectedK: 1850 },
    { month: 'Aug 26', floods: 16, cyclones: 4, earthquakes: 3, fires: 1, totalEvents: 24, populationAffectedK: 2100 },
    { month: 'Sep 26', floods: 12, cyclones: 6, earthquakes: 2, fires: 2, totalEvents: 22, populationAffectedK: 1760 },
    { month: 'Oct 26 (Current)', floods: 8, cyclones: 4, earthquakes: 3, fires: 2, totalEvents: 17, populationAffectedK: 1480 },
  ] as MonthlyDisasterTrendPoint[],

  // District Response Performance
  districtPerformance: [
    { district: 'Puri Coastal', responseMinutes: 14, evacuatedPercentage: 92, teamsDeployed: 48 },
    { district: 'Kaziranga Basin', responseMinutes: 18, evacuatedPercentage: 86, teamsDeployed: 34 },
    { district: 'Kangra Valley', responseMinutes: 22, evacuatedPercentage: 79, teamsDeployed: 26 },
    { district: 'East Godavari', responseMinutes: 16, evacuatedPercentage: 88, teamsDeployed: 22 },
    { district: 'South 24 Parganas', responseMinutes: 15, evacuatedPercentage: 91, teamsDeployed: 31 },
    { district: 'Ratnagiri Coast', responseMinutes: 19, evacuatedPercentage: 84, teamsDeployed: 24 },
    { district: 'Supaul Plains', responseMinutes: 26, evacuatedPercentage: 74, teamsDeployed: 28 },
    { district: 'Mayurbhanj Hills', responseMinutes: 29, evacuatedPercentage: 72, teamsDeployed: 19 },
  ] as DistrictResponseLatencyPoint[],

  // Severity Distribution
  severityBreakdown: [
    { name: 'Critical Severity', count: 4, percentage: 20, fill: '#EF4444' },
    { name: 'High Severity', count: 7, percentage: 35, fill: '#F59E0B' },
    { name: 'Moderate Severity', count: 6, percentage: 30, fill: '#2563EB' },
    { name: 'Low / Contained', count: 3, percentage: 15, fill: '#22C55E' },
  ],

  executiveKPIs: {
    totalIncidentsRecordedYTD: 186,
    avgEvacuationSuccessRate: '91.4%',
    medianDispatchLatencyMinutes: 16.2,
    livesSecuredEstimated: '4.8M',
    totalReliefSortiesFlown: 1240,
    infrastructureResilienceScore: 84.7,
  },
};
