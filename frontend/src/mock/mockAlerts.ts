export interface LiveAlertItem {
  id: string;
  priority: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  type: 'CYCLONE' | 'FLOOD' | 'EARTHQUAKE' | 'FIRE' | 'INFRASTRUCTURE';
  location: string;
  timestamp: string;
  status: 'BROADCASTED' | 'DISPATCHING' | 'PENDING' | 'RESOLVED';
  description: string;
  sourceAgency: string;
}

export const mockAlerts: LiveAlertItem[] = [
  {
    id: 'ALT-4091',
    priority: 'CRITICAL',
    type: 'CYCLONE',
    location: 'Puri Coastal Zone 1-4',
    timestamp: '2 mins ago',
    status: 'BROADCASTED',
    description: 'Cat 4 Landfall expected within 180 mins. Maximum storm surge alert activated.',
    sourceAgency: 'India Meteorological Dept (IMD)',
  },
  {
    id: 'ALT-4090',
    priority: 'CRITICAL',
    type: 'FLOOD',
    location: 'Brahmaputra Sector 4 Embankment',
    timestamp: '14 mins ago',
    status: 'DISPATCHING',
    description: 'Breach detected by UAV Sentinel. 34,000 residents in direct downstream vector.',
    sourceAgency: 'Central Water Commission (CWC)',
  },
  {
    id: 'ALT-4089',
    priority: 'HIGH',
    type: 'EARTHQUAKE',
    location: 'Kangra Valley District',
    timestamp: '28 mins ago',
    status: 'BROADCASTED',
    description: 'M6.4 hypocenter shockwaves. Bridge infrastructure check in progress on NH-154.',
    sourceAgency: 'National Seismological Network',
  },
  {
    id: 'ALT-4088',
    priority: 'HIGH',
    type: 'FIRE',
    location: 'Simlipal Biosphere Core Zone',
    timestamp: '45 mins ago',
    status: 'DISPATCHING',
    description: 'Wind shift pushing blaze towards National Park boundary. Aerial drop initiated.',
    sourceAgency: 'Forest Survey of India (FSI)',
  },
  {
    id: 'ALT-4087',
    priority: 'HIGH',
    type: 'FLOOD',
    location: 'Kosi Barrage Sluice #18',
    timestamp: '1 hour ago',
    status: 'BROADCASTED',
    description: 'Discharge increased to 410,000 cusecs. Immediate evacuation of sandbar hamlets.',
    sourceAgency: 'Bihar Disaster Management Authority',
  },
  {
    id: 'ALT-4086',
    priority: 'MODERATE',
    type: 'INFRASTRUCTURE',
    location: 'Ratnagiri Port Substation #2',
    timestamp: '1.5 hours ago',
    status: 'DISPATCHING',
    description: 'Lightning strike damaged high-voltage relay. Auxiliary diesel generators engaged.',
    sourceAgency: 'Maharashtra State Electricity Board',
  },
  {
    id: 'ALT-4085',
    priority: 'MODERATE',
    type: 'CYCLONE',
    location: 'Nagapattinam Deep Harbour',
    timestamp: '2 hours ago',
    status: 'PENDING',
    description: 'Harbour warning flag 7 hoisted. Small craft advisory in effect until 24:00 UTC.',
    sourceAgency: 'Port Authorities Division',
  },
  {
    id: 'ALT-4084',
    priority: 'LOW',
    type: 'FIRE',
    location: 'Gir Sanctuary Outskirts',
    timestamp: '3.5 hours ago',
    status: 'RESOLVED',
    description: 'Brushfire contained by local forest beat team. Thermal boundary verified cold.',
    sourceAgency: 'Gujarat Forest Dept',
  },
  {
    id: 'ALT-4083',
    priority: 'CRITICAL',
    type: 'FLOOD',
    location: 'Sundarbans Sagar Island Delta',
    timestamp: '4 hours ago',
    status: 'BROADCASTED',
    description: 'Spring high tide overtopping earthen embankment. Rapid amphibious rescue active.',
    sourceAgency: 'West Bengal Disaster Management',
  },
];
