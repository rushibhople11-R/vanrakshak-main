import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { mockStorage } from '../services/mockStorage';
import { PatrolUnit, DispatchRecord, Alert } from '../types';
import { StatCard } from '../components/common/StatCard';
import {
  ShieldAlert,
  Radio,
  Users,
  Compass,
  Clock,
  Send,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Plus,
  Car,
  MapPin,
  Flame,
  Check,
} from 'lucide-react';

export const PatrolDispatchPage: React.FC = () => {
  const [patrols, setPatrols] = useState<PatrolUnit[]>([]);
  const [dispatches, setDispatches] = useState<DispatchRecord[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [selectedAlertId, setSelectedAlertId] = useState('');
  const [selectedPatrolId, setSelectedPatrolId] = useState('');
  const [priority, setPriority] = useState<'CRITICAL' | 'HIGH' | 'MEDIUM'>('CRITICAL');
  const [dispatchNotes, setDispatchNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [patrolsData, dispatchesData, alertsData] = await Promise.all([
        api.getPatrolUnits(),
        api.getDispatchRecords(),
        api.getAlerts(),
      ]);
      setPatrols(patrolsData);
      setDispatches(dispatchesData);
      setAlerts(alertsData);
      if (alertsData.length > 0) {
        setSelectedAlertId(alertsData[0].id);
      }
      if (patrolsData.length > 0) {
        setSelectedPatrolId(patrolsData[0].id);
      }
    } catch (e) {
      setPatrols(mockStorage.getPatrolUnits());
      setDispatches(mockStorage.getDispatchRecords());
      setAlerts(mockStorage.getAlerts());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (patrolId: string, newStatus: any) => {
    await api.updatePatrolStatus(patrolId, newStatus);
    loadData();
  };

  const handleDispatchStatusChange = async (dispatchId: string, newStatus: any) => {
    await api.updateDispatchStatus(dispatchId, newStatus);
    loadData();
  };

  const handleSubmitDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAlertId || !selectedPatrolId) return;
    setIsSubmitting(true);

    const alert = alerts.find((a) => a.id === selectedAlertId);
    const patrol = patrols.find((p) => p.id === selectedPatrolId);

    if (alert && patrol) {
      await api.createDispatchRecord({
        alertId: alert.id,
        patrolId: patrol.id,
        patrolName: patrol.name,
        nodeId: alert.nodeId,
        zone: alert.zone,
        priority,
        etaMinutes: Math.floor(6 + Math.random() * 12),
        status: 'en_route',
        radioChannel: patrol.contactChannel,
        notes: dispatchNotes || `Urgent dispatch for acoustic ${alert.eventType} detected at ${alert.zone}.`,
      });
      setIsDispatchModalOpen(false);
      setDispatchNotes('');
      await loadData();
    }
    setIsSubmitting(false);
  };

  const availableCount = patrols.filter((p) => p.status === 'available' || p.status === 'patrolling').length;
  const dispatchedCount = patrols.filter((p) => p.status === 'dispatched' || p.status === 'on_scene').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-forest-800" />
            <h1 className="text-xl font-bold text-slate-900">Ranger Field Operations & Incident Dispatch</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time command coordination between VanRakshak LoRa acoustic detections and forest patrol units
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDispatchModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-forest-800 hover:bg-forest-900 text-white font-semibold text-xs rounded-xl shadow-sm transition-all active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Dispatch Patrol Unit</span>
          </button>
          <button
            onClick={loadData}
            className="p-2 border border-slate-200 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors"
            title="Refresh Operations"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Patrol Units"
          value={`${patrols.length} Units`}
          subtitle="Forest division strike squads active"
          icon={Users}
          variant="forest"
          badgeText="Ground Units"
        />
        <StatCard
          title="Ready / Patrolling"
          value={availableCount}
          subtitle="Available for immediate acoustic intercept"
          icon={CheckCircle2}
          variant="teal"
          badgeText="Active Patrol"
        />
        <StatCard
          title="Dispatched on Incidents"
          value={dispatchedCount}
          subtitle="Engaged in threat verification"
          icon={Flame}
          variant={dispatchedCount > 0 ? 'danger' : 'forest'}
          badgeText={dispatchedCount > 0 ? 'Active Missions' : 'All Clear'}
        />
        <StatCard
          title="Avg Intercept Time"
          value="8.4 mins"
          subtitle="Calculated across 4 forest zones"
          icon={Clock}
          variant="warning"
          badgeText="VHF Ch-04 Link"
        />
      </div>

      {/* Ranger Units Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-forest-700" />
              <span>Forest Ranger Units Registry</span>
            </h3>
            <p className="text-xs text-slate-500">
              Assigned tactical units, radio callsigns, and live field GPS readiness
            </p>
          </div>
          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
            VHF Relay Active (156.100 - 156.400 MHz)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {patrols.map((patrol) => {
            const isDispatched = patrol.status === 'dispatched' || patrol.status === 'on_scene';
            return (
              <div
                key={patrol.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4 hover:border-forest-300 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">{patrol.name}</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {patrol.badge}
                      </span>
                    </div>
                    <p className="text-xs text-forest-800 font-medium">
                      Leader: {patrol.leader} • <span className="text-slate-500">{patrol.teamSize} Rangers</span>
                    </p>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold capitalize ${
                      patrol.status === 'dispatched'
                        ? 'bg-red-50 text-alert-red border border-red-200 animate-pulse'
                        : patrol.status === 'on_scene'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : patrol.status === 'patrolling'
                        ? 'bg-forest-50 text-forest-800 border border-forest-200'
                        : 'bg-tealbrand-50 text-tealbrand-700 border border-tealbrand-200'
                    }`}
                  >
                    {patrol.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Radio className="w-3.5 h-3.5 text-tealbrand-600 flex-shrink-0" />
                    <span className="truncate">{patrol.contactChannel}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-forest-600 flex-shrink-0" />
                    <span className="truncate">{patrol.assignedZone}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Car className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                    <span className="truncate">{patrol.vehicle}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Compass className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                    <span className="truncate font-mono text-[10px]">{patrol.currentCoordinates}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1 flex-wrap">
                    {patrol.equipment.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  <select
                    value={patrol.status}
                    onChange={(e) => handleStatusChange(patrol.id, e.target.value)}
                    className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 font-semibold focus:outline-none focus:border-forest-600"
                  >
                    <option value="available">Set: Available</option>
                    <option value="patrolling">Set: Patrolling</option>
                    <option value="dispatched">Set: Dispatched</option>
                    <option value="on_scene">Set: On Scene</option>
                    <option value="standby">Set: Standby</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dispatched Missions Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Compass className="w-4 h-4 text-forest-700" />
              <span>Active & Recent Incident Dispatch Missions</span>
            </h3>
            <p className="text-xs text-slate-500">
              Chronological log of ranger unit field deployments triggered by acoustic edge detections
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Total Missions: {dispatches.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-600 font-bold">
                <th className="py-2.5 px-3">Mission ID</th>
                <th className="py-2.5 px-3">Patrol Unit</th>
                <th className="py-2.5 px-3">Target Node / Zone</th>
                <th className="py-2.5 px-3">Priority</th>
                <th className="py-2.5 px-3">Est. ETA</th>
                <th className="py-2.5 px-3">Mission Status</th>
                <th className="py-2.5 px-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dispatches.map((dsp) => (
                <tr key={dsp.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-slate-700">
                    {dsp.id}
                  </td>
                  <td className="py-3 px-3">
                    <p className="font-bold text-slate-900">{dsp.patrolName}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{dsp.radioChannel}</p>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-forest-900">{dsp.nodeId}</span>
                    <span className="text-slate-500 text-[11px] ml-1.5">({dsp.zone})</span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        dsp.priority === 'CRITICAL'
                          ? 'bg-red-100 text-alert-red'
                          : dsp.priority === 'HIGH'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {dsp.priority}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-700">
                    {dsp.etaMinutes} mins
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold capitalize ${
                        dsp.status === 'en_route'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : dsp.status === 'on_scene'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : dsp.status === 'resolved'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {dsp.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <select
                      value={dsp.status}
                      onChange={(e) => handleDispatchStatusChange(dsp.id, e.target.value)}
                      className="text-[11px] border border-slate-200 rounded px-2 py-1 bg-white text-slate-700 font-medium"
                    >
                      <option value="en_route">En Route</option>
                      <option value="on_scene">On Scene</option>
                      <option value="investigating">Investigating</option>
                      <option value="resolved">Mark Resolved</option>
                      <option value="recalled">Recall Unit</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dispatch Modal */}
      {isDispatchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-forest-800" />
                <h3 className="font-bold text-slate-900 text-base">Dispatch Ranger Tactical Unit</h3>
              </div>
              <button
                onClick={() => setIsDispatchModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitDispatch} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Triggering Alert</label>
                <select
                  value={selectedAlertId}
                  onChange={(e) => setSelectedAlertId(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-2.5 bg-slate-50 focus:bg-white text-slate-900 font-medium focus:outline-none focus:border-forest-600"
                >
                  {alerts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.nodeId} — {a.eventType.replace('_', ' ').toUpperCase()} ({Math.round(a.confidence * 100)}% Conf) • {a.zone}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Assign Patrol Unit</label>
                <select
                  value={selectedPatrolId}
                  onChange={(e) => setSelectedPatrolId(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-2.5 bg-slate-50 focus:bg-white text-slate-900 font-medium focus:outline-none focus:border-forest-600"
                >
                  {patrols.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.assignedZone} • {p.contactChannel}) — Status: {p.status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Priority Level</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full border border-slate-200 rounded-xl p-2.5 bg-slate-50 focus:bg-white text-slate-900 font-medium focus:outline-none focus:border-forest-600"
                  >
                    <option value="CRITICAL">P1 - CRITICAL (Chainsaw / Poaching)</option>
                    <option value="HIGH">P2 - HIGH (Acoustic Anomaly)</option>
                    <option value="MEDIUM">P3 - MEDIUM (Routine Check)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Estimated Intercept Time</label>
                  <input
                    type="text"
                    disabled
                    value="~8-12 minutes"
                    className="w-full border border-slate-200 rounded-xl p-2.5 bg-slate-100 text-slate-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tactical Briefing Notes</label>
                <textarea
                  rows={3}
                  value={dispatchNotes}
                  onChange={(e) => setDispatchNotes(e.target.value)}
                  placeholder="e.g. Approach cautiously via ridge track 4. Suspected illegal cutting near river bed."
                  className="w-full border border-slate-200 rounded-xl p-2.5 bg-slate-50 focus:bg-white text-slate-900 focus:outline-none focus:border-forest-600"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-950 flex items-start gap-2 text-[11px]">
                <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <span>
                  Confirming dispatch will transmit deployment orders via VHF Radio Relay and update the alert queue status to <strong>Patrol Requested</strong>.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDispatchModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-forest-800 hover:bg-forest-900 text-white font-bold rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Confirm Dispatch</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
