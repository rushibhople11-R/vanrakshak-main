export type NodeStatus = 'online' | 'offline' | 'warning';

export interface SensorNode {
  id: string;
  nodeId: string;
  name: string;
  zone: string;
  status: NodeStatus;
  batteryPercentage: number;
  solarCharging: boolean;
  signalStrength: number; // e.g., -85 dBm (RSSI)
  firmwareVersion: string;
  modelVersion: string;
  lastSeenAt: string;
  lastEventType?: string;
  createdAt: string;
  updatedAt: string;
}

export type AlertEventType = 'possible_chainsaw' | 'background' | 'soundscape_anomaly';
export type AlertStatus = 'pending' | 'verified' | 'false_positive' | 'patrol_requested' | 'assigned';

export interface Alert {
  id: string;
  nodeId: string;
  eventType: AlertEventType;
  confidence: number; // Stored 0.0 to 1.0, displayed as percentage
  timestamp: string;
  zone: string;
  batteryPercentage: number;
  sequenceNumber: number;
  status: AlertStatus;
  verificationNote?: string;
  evidenceImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VerificationAction {
  id: string;
  alertId: string;
  userId: string;
  userName?: string;
  action: 'verified' | 'false_positive' | 'assign_review' | 'request_patrol';
  note: string;
  createdAt: string;
}

export interface SystemMetrics {
  id: string;
  metricDate: string;
  activeNodes: number;
  totalAlerts: number;
  verifiedAlerts: number;
  falsePositives: number;
  pendingVerification: number;
  packetDeliveryRate: number; // e.g. 98.4%
  averageAlertLatency: number; // e.g. 2.4s
  averageBattery: number; // e.g. 78%
}

export interface ProjectSettings {
  key: string;
  value: string;
  updatedAt: string;
}

export type UserRole = 'ranger' | 'admin' | 'guest';

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  email: string;
  mobileNumber?: string;
  badgeNumber?: string;
  division?: string;
  beat?: string;
  emergencyContact?: string;
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  lastLoginAt?: string;
}

export interface RegisterPayload {
  name: string;
  mobileNumber: string;
  email: string;
  password: string;
  role?: UserRole;
  division?: string;
  beat?: string;
  badgeNumber?: string;
  emergencyContact?: string;
}

export interface IngestAlertPayload {
  nodeId: string;
  eventType: 'possible_chainsaw' | 'background' | 'soundscape_anomaly';
  confidence: number;
  timestamp: string;
  batteryPercentage: number;
  sequenceNumber: number;
  zone: string;
}

export type PatrolStatus = 'available' | 'dispatched' | 'on_scene' | 'patrolling' | 'standby';

export interface PatrolUnit {
  id: string;
  name: string;
  callsign: string;
  badge: string;
  leader: string;
  contactChannel: string;
  status: PatrolStatus;
  assignedZone: string;
  currentCoordinates: string;
  activeAlertId?: string;
  lastContactAt: string;
  teamSize: number;
  vehicle: string;
  equipment: string[];
}

export interface DispatchRecord {
  id: string;
  alertId: string;
  patrolId: string;
  patrolName: string;
  nodeId: string;
  zone: string;
  dispatchedAt: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  etaMinutes: number;
  status: 'en_route' | 'on_scene' | 'investigating' | 'resolved' | 'recalled';
  radioChannel: string;
  notes: string;
}

export interface RfNodeTelemetry {
  nodeId: string;
  name: string;
  zone: string;
  rssi: number;
  snr: number;
  frequencyMHz: number;
  bandwidthKHz: number;
  spreadingFactor: number;
  packetLossPct: number;
  hopCount: number;
  solarYieldWatts: number;
  batteryHealthPct: number;
  firmware: string;
  modelVersion: string;
}

export interface ThreatForecastZone {
  zone: string;
  name: string;
  riskScore: number;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  canopyDensity: string;
  roadProximityKm: number;
  historicalIncidentsCount: number;
  threatWindow: string;
  recommendedPatrols: number;
  statusSummary: string;
}

export interface ForensicReport {
  dossierId: string;
  alertId: string;
  nodeId: string;
  zone: string;
  detectedAt: string;
  incidentType: string;
  confidenceScore: number;
  legalActClause: string;
  sha256Hash: string;
  gpsCoordinates: string;
  verifiedBy: string;
  investigatingOfficer: string;
  evidenceSummary: string;
}

