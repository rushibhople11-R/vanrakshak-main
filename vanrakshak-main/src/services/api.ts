import { SensorNode, Alert, VerificationAction, SystemMetrics, IngestAlertPayload, User, RegisterPayload } from '../types';
import { mockStorage } from './mockStorage';

const BASE_URL = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('vr_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/**
 * Robust JSON fetch helper:
 * Verifies HTTP 2xx AND verifies Content-Type is 'application/json'.
 * If the backend is offline or if Vercel SPA rewrite returns index.html,
 * this safely returns null instead of throwing unhandled JSON parse SyntaxErrors.
 */
async function safeFetchJson<T>(url: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';
    if (!res.ok || !contentType.includes('application/json')) {
      return null;
    }
    const data = await res.json();
    return data as T;
  } catch (e) {
    return null;
  }
}

export const api = {
  // Authentication & User Profile
  async register(payload: RegisterPayload): Promise<{ token: string; user: User; message?: string }> {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    if (data.token) {
      localStorage.setItem('vr_token', data.token);
    }
    return data;
  },

  async loginWithCredentials(identifier: string, password?: string): Promise<{ token: string; user: User }> {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Login failed');
    }

    if (data.token) {
      localStorage.setItem('vr_token', data.token);
    }
    return data;
  },

  async updateProfile(profileData: Partial<User>): Promise<{ success: boolean; user: User; message?: string }> {
    const res = await fetch(`${BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Profile update failed');
    }
    return data;
  },

  async getUsers(): Promise<User[]> {
    const data = await safeFetchJson<User[]>(`${BASE_URL}/auth/users`);
    return data || [];
  },

  async login(role: string): Promise<{ token: string; user: User }> {
    const data = await safeFetchJson<{ token: string; user: User }>(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });

    if (data && data.user) {
      localStorage.setItem('vr_token', data.token);
      return data;
    }

    // Client-side fallback for Vercel/offline
    const user = mockStorage.switchUser(role as any);
    const token = `demo_token_${user.id}_${Date.now()}`;
    localStorage.setItem('vr_token', token);
    return { token, user };
  },

  async getMe(): Promise<{ user: User; authenticated: boolean; isGuest: boolean }> {
    const data = await safeFetchJson<{ user: User; authenticated: boolean; isGuest: boolean }>(`${BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
    });

    if (data && data.user) {
      return data;
    }

    const user = mockStorage.getCurrentUser();
    return { user, authenticated: user.role !== 'guest', isGuest: user.role === 'guest' };
  },

  async logout(): Promise<void> {
    await safeFetchJson(`${BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    localStorage.removeItem('vr_token');
    mockStorage.switchUser('guest');
  },

  // Sensor Nodes
  async getNodes(): Promise<SensorNode[]> {
    const data = await safeFetchJson<SensorNode[]>(`${BASE_URL}/nodes`);
    if (data && Array.isArray(data) && data.length > 0) {
      return data;
    }
    return mockStorage.getNodes();
  },

  async getNode(nodeId: string): Promise<SensorNode> {
    const data = await safeFetchJson<SensorNode>(`${BASE_URL}/nodes/${nodeId}`);
    if (data) {
      return data;
    }
    const node = mockStorage.getNode(nodeId);
    if (!node) throw new Error(`Node ${nodeId} not found`);
    return node;
  },

  async createNode(nodeData: Partial<SensorNode>): Promise<SensorNode> {
    const data = await safeFetchJson<SensorNode>(`${BASE_URL}/nodes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(nodeData),
    });
    if (data) return data;
    return mockStorage.createNode(nodeData);
  },

  async updateNode(nodeId: string, nodeData: Partial<SensorNode>): Promise<SensorNode> {
    const data = await safeFetchJson<SensorNode>(`${BASE_URL}/nodes/${nodeId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(nodeData),
    });
    if (data) return data;
    return mockStorage.updateNode(nodeId, nodeData);
  },

  async deleteNode(nodeId: string): Promise<{ success: boolean }> {
    const data = await safeFetchJson<{ success: boolean }>(`${BASE_URL}/nodes/${nodeId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (data) return data;
    return mockStorage.deleteNode(nodeId);
  },

  // Alerts
  async getAlerts(params?: { eventType?: string; zone?: string; status?: string }): Promise<Alert[]> {
    const query = new URLSearchParams();
    if (params?.eventType) query.append('eventType', params.eventType);
    if (params?.zone) query.append('zone', params.zone);
    if (params?.status) query.append('status', params.status);

    const data = await safeFetchJson<Alert[]>(`${BASE_URL}/alerts?${query.toString()}`);
    if (data && Array.isArray(data) && data.length > 0) {
      return data;
    }
    return mockStorage.getAlerts(params);
  },

  async getAlert(id: string): Promise<Alert & { actions: VerificationAction[] }> {
    const data = await safeFetchJson<Alert & { actions: VerificationAction[] }>(`${BASE_URL}/alerts/${id}`);
    if (data) return data;
    const alert = mockStorage.getAlert(id);
    if (!alert) throw new Error(`Alert ${id} not found`);
    return alert;
  },

  async updateAlertStatus(
    id: string,
    status: string,
    note: string,
    userId?: string,
    userName?: string
  ): Promise<Alert & { actions: VerificationAction[] }> {
    const data = await safeFetchJson<Alert & { actions: VerificationAction[] }>(`${BASE_URL}/alerts/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, note, userId, userName }),
    });
    if (data) return data;
    return mockStorage.updateAlertStatus(id, status, note, userId, userName);
  },

  // Verification Actions
  async getActions(): Promise<VerificationAction[]> {
    const data = await safeFetchJson<VerificationAction[]>(`${BASE_URL}/actions`);
    if (data && Array.isArray(data)) return data;
    return mockStorage.getActions();
  },

  // System Metrics
  async getMetrics(): Promise<SystemMetrics & {
    totalNodes: number;
    warningNodes: number;
    offlineNodes: number;
    patrolRequested: number;
    gatewayStatus: string;
    dailyTrend: { day: string; total: number; verified: number; falsePositive: number }[];
  }> {
    const data = await safeFetchJson<any>(`${BASE_URL}/metrics`);
    if (data && data.totalNodes !== undefined) return data;
    return mockStorage.getMetrics() as any;
  },

  // Project Settings
  async getSettings(): Promise<Record<string, string>> {
    const data = await safeFetchJson<Record<string, string>>(`${BASE_URL}/settings`);
    if (data) return data;
    return {
      demo_mode: 'true',
      gateway_status: 'online',
      chainsaw_threshold: '0.85',
      model_version: 'vanrakshak-tinyml-v1.4',
      lora_frequency_mhz: '865.0625',
      lora_region: 'IN865',
    };
  },

  // Simulation
  async simulateChainsawAlert(targetNodeId?: string, customConfidence?: number) {
    const data = await safeFetchJson<any>(`${BASE_URL}/simulation/chainsaw-alert`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ targetNodeId, customConfidence }),
    });
    if (data && data.alert) return data;
    return mockStorage.simulateChainsawAlert(targetNodeId, customConfidence);
  },

  async simulateBackgroundEvent(targetNodeId?: string) {
    const data = await safeFetchJson<any>(`${BASE_URL}/simulation/background-event`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ targetNodeId }),
    });
    if (data && data.success) return data;
    return mockStorage.simulateBackgroundEvent(targetNodeId);
  },

  // Hardware Ingest (Planned Interface)
  async ingestHardwareAlert(payload: IngestAlertPayload, apiKey?: string) {
    const data = await safeFetchJson<any>(`${BASE_URL}/ingest/alert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey || 'vr_dev_test_device_key_in865',
      },
      body: JSON.stringify(payload),
    });
    if (data) return data;
    return {
      status: 'accepted',
      integrationStage: 'Planned Hardware Integration Interface',
      message: 'Packet validated and processed through VanRakshak simulation pipeline.',
      packetSummary: payload,
    };
  },

  // Field Patrol & Dispatch Operations
  async getPatrolUnits() {
    const data = await safeFetchJson<any[]>(`${BASE_URL}/patrols`);
    if (data && Array.isArray(data) && data.length > 0) return data;
    return mockStorage.getPatrolUnits();
  },

  async updatePatrolStatus(patrolId: string, status: any) {
    const data = await safeFetchJson<any>(`${BASE_URL}/patrols/${patrolId}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    if (data) return data;
    return mockStorage.updatePatrolStatus(patrolId, status);
  },

  async getDispatchRecords() {
    const data = await safeFetchJson<any[]>(`${BASE_URL}/dispatches`);
    if (data && Array.isArray(data) && data.length > 0) return data;
    return mockStorage.getDispatchRecords();
  },

  async createDispatchRecord(dispatchData: any) {
    const data = await safeFetchJson<any>(`${BASE_URL}/dispatches`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(dispatchData),
    });
    if (data) return data;
    return mockStorage.createDispatchRecord(dispatchData);
  },

  async updateDispatchStatus(dispatchId: string, status: any) {
    const data = await safeFetchJson<any>(`${BASE_URL}/dispatches/${dispatchId}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    if (data) return data;
    return mockStorage.updateDispatchStatus(dispatchId, status);
  },

  // LoRa RF Telemetry
  async getRfTelemetry() {
    const data = await safeFetchJson<any[]>(`${BASE_URL}/telemetry/rf`);
    if (data && Array.isArray(data) && data.length > 0) return data;
    return mockStorage.getRfTelemetry();
  },

  // Threat Forecast Zones
  async getThreatForecastZones() {
    const data = await safeFetchJson<any[]>(`${BASE_URL}/threats/forecast`);
    if (data && Array.isArray(data) && data.length > 0) return data;
    return mockStorage.getThreatForecastZones();
  },

  // Forensic Reports
  async getForensicReports() {
    const data = await safeFetchJson<any[]>(`${BASE_URL}/reports`);
    if (data && Array.isArray(data) && data.length > 0) return data;
    return mockStorage.getForensicReports();
  },

  async createForensicReport(reportData: any) {
    const data = await safeFetchJson<any>(`${BASE_URL}/reports`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(reportData),
    });
    if (data) return data;
    return mockStorage.createForensicReport(reportData);
  },
};

