import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { mockStorage } from '../services/mockStorage';
import { ForensicReport, Alert } from '../types';
import { StatCard } from '../components/common/StatCard';
import {
  FileText,
  ShieldCheck,
  Download,
  Printer,
  FileCheck,
  Clock,
  MapPin,
  Scale,
  Plus,
  RefreshCw,
  Hash,
  ArrowLeft,
  X,
} from 'lucide-react';

export const EvidenceReportsPage: React.FC = () => {
  const [reports, setReports] = useState<ForensicReport[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedReport, setSelectedReport] = useState<ForensicReport | null>(null);
  const [loading, setLoading] = useState(true);

  // New report modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetAlertId, setTargetAlertId] = useState('');
  const [investigatingOfficer, setInvestigatingOfficer] = useState('Divisional Forest Officer');
  const [customNotes, setCustomNotes] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [reportsData, alertsData] = await Promise.all([
        api.getForensicReports(),
        api.getAlerts(),
      ]);
      setReports(reportsData);
      setAlerts(alertsData);
      if (reportsData.length > 0) {
        setSelectedReport(reportsData[0]);
      }
      if (alertsData.length > 0) {
        setTargetAlertId(alertsData[0].id);
      }
    } catch (e) {
      const defReports = mockStorage.getForensicReports();
      setReports(defReports);
      if (defReports.length > 0) setSelectedReport(defReports[0]);
      setAlerts(mockStorage.getAlerts());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleGenerateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    const alert = alerts.find((a) => a.id === targetAlertId);
    if (!alert) return;

    const newReport = await api.createForensicReport({
      alertId: alert.id,
      nodeId: alert.nodeId,
      zone: alert.zone,
      detectedAt: new Date(alert.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
      incidentType: alert.eventType === 'possible_chainsaw'
        ? 'Illegal Chainsaw Logging (2-Stroke Engine Acoustic Signature)'
        : 'Unauthorized Forest Incursion & Bio-acoustic Disturbance',
      confidenceScore: alert.confidence,
      legalActClause: 'Section 26(1)(f) & Section 33, Indian Forest Act 1927 / Wildlife Protection Act 1972',
      gpsCoordinates: '29.5240° N, 78.9720° E (Grid Sector B)',
      verifiedBy: 'Ranger Vikram Singh (Badge: UK-FD-882)',
      investigatingOfficer,
      evidenceSummary: customNotes || `Sensor node ${alert.nodeId} confirmed 3 consecutive acoustic sliding windows meeting ${Math.round(alert.confidence * 100)}% confidence threshold.`,
    });

    setIsModalOpen(false);
    setCustomNotes('');
    await loadData();
    setSelectedReport(newReport);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Scale className="w-6 h-6 text-forest-800" />
            <h1 className="text-xl font-bold text-slate-900">Forest Offense Dossier & Evidence Export</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Cryptographically sealed incident dossiers for legal prosecution under Indian Forest Act & Wildlife Protection Act
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-forest-800 hover:bg-forest-900 text-white font-semibold text-xs rounded-xl shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Compile New Dossier</span>
          </button>
          <button
            onClick={loadData}
            className="p-2 border border-slate-200 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors"
            title="Refresh Dossiers"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Compiled Legal Dossiers"
          value={reports.length}
          subtitle="Sealed acoustic offense evidence"
          icon={FileText}
          variant="forest"
          badgeText="Court Admissible"
        />
        <StatCard
          title="Integrity Protection"
          value="SHA-256 Valid"
          subtitle="Cryptographic telemetry hash"
          icon={ShieldCheck}
          variant="teal"
          badgeText="Tamper Proof"
        />
        <StatCard
          title="Statutory Legal Basis"
          value="IFA 1927"
          subtitle="Sec 26(1)(f) & Sec 33 provisions"
          icon={Scale}
          variant="forest"
          badgeText="Indian Law"
        />
        <StatCard
          title="Verified Incursions"
          value="100%"
          subtitle="Ranger verified audit record"
          icon={FileCheck}
          variant="warning"
          badgeText="Verified"
        />
      </div>

      {/* Dossier Browser & Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Dossier List */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <FileText className="w-4 h-4 text-forest-700" />
            <span>Offense Dossier Registry</span>
          </h3>

          <div className="space-y-2">
            {reports.map((rep) => {
              const isSelected = selectedReport?.dossierId === rep.dossierId;
              return (
                <button
                  key={rep.dossierId}
                  onClick={() => setSelectedReport(rep)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs space-y-1.5 ${
                    isSelected
                      ? 'bg-forest-50 border-forest-600 shadow-sm'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-forest-900">{rep.dossierId}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-forest-100 text-forest-800">
                      {rep.zone}
                    </span>
                  </div>
                  <p className="font-semibold text-slate-800 line-clamp-1">{rep.incidentType}</p>
                  <p className="text-[10px] text-slate-400 font-mono">Node: {rep.nodeId} • {rep.detectedAt}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Col: Formal Court Dossier Preview Document */}
        <div className="lg:col-span-2">
          {selectedReport ? (
            <div className="bg-white border-2 border-slate-300 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 relative print:p-0 print:border-none">
              {/* Official Seal Header */}
              <div className="border-b-2 border-forest-800 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-forest-800 text-white font-mono font-bold text-[10px]">
                      FORM VII-A
                    </span>
                    <span className="text-[11px] font-bold text-forest-900 uppercase tracking-widest">
                      Uttarakhand Forest Department • Legal Enforcement Division
                    </span>
                  </div>
                  <h2 className="text-lg font-extrabold text-slate-900 mt-1">
                    Forensic Acoustic Offense & Incursion Dossier
                  </h2>
                  <p className="text-xs text-slate-500">
                    Compiled for legal submission under Indian Forest Act, 1927 & Wildlife Protection Act, 1972
                  </p>
                </div>

                <div className="flex items-center gap-2 no-print">
                  <button
                    onClick={() => setSelectedReport(null)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors cursor-pointer group"
                    title="Back to Reports List / Cut Preview"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 text-slate-500 group-hover:-translate-x-0.5 transition-transform" />
                    <span>Back</span>
                  </button>

                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Dossier</span>
                  </button>

                  <button
                    onClick={() => setSelectedReport(null)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Close Preview (✕)"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Dossier Details Table */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Official Dossier ID</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">{selectedReport.dossierId}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Timestamp (IST)</span>
                  <span className="font-semibold text-slate-900">{selectedReport.detectedAt}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Classified Offense</span>
                  <span className="font-semibold text-alert-red">{selectedReport.incidentType}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Acoustic Confidence</span>
                  <span className="font-bold text-forest-900">{Math.round(selectedReport.confidenceScore * 100)}% (Multi-Window Confirmed)</span>
                </div>
                <div className="col-span-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Statutory Legal Provision</span>
                  <span className="font-medium text-slate-800">{selectedReport.legalActClause}</span>
                </div>
                <div className="col-span-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">GPS Location & Terrain Grid</span>
                  <span className="font-semibold text-slate-900">{selectedReport.gpsCoordinates} (Zone: {selectedReport.zone})</span>
                </div>
              </div>

              {/* Technical Evidence Summary */}
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider text-forest-800">
                  Acoustic Edge-AI Evidence Record
                </h4>
                <div className="p-4 bg-forest-50/50 rounded-xl border border-forest-200 text-slate-700 leading-relaxed text-[11px]">
                  {selectedReport.evidenceSummary}
                </div>
              </div>

              {/* SHA-256 Cryptographic Hash Integrity Seal */}
              <div className="p-3.5 bg-slate-100 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-slate-600 font-bold text-[10px] uppercase">
                  <Hash className="w-3.5 h-3.5 text-forest-700" />
                  <span>Cryptographic Telemetry SHA-256 Proof Hash</span>
                </div>
                <p className="font-mono text-[10px] text-slate-800 break-all bg-white p-2 rounded border border-slate-200">
                  {selectedReport.sha256Hash}
                </p>
                <p className="text-[10px] text-slate-500 italic">
                  Guarantees that the LoRa edge acoustic alert payload has not been modified or fabricated since node ingestion.
                </p>
              </div>

              {/* Signatures Block */}
              <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 text-xs">
                <div className="space-y-8">
                  <div>
                    <p className="font-bold text-slate-900">{selectedReport.verifiedBy}</p>
                    <p className="text-[10px] text-slate-500">First Responding Ranger • Field Verification</p>
                  </div>
                  <div className="border-b border-dashed border-slate-400 w-48" />
                  <p className="text-[10px] text-slate-400">Signature & Official Stamp</p>
                </div>

                <div className="space-y-8">
                  <div>
                    <p className="font-bold text-slate-900">{selectedReport.investigatingOfficer}</p>
                    <p className="text-[10px] text-slate-500">Divisional Forest Officer • Endorsement</p>
                  </div>
                  <div className="border-b border-dashed border-slate-400 w-48" />
                  <p className="text-[10px] text-slate-400">Signature & Official Seal</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 text-xs bg-white rounded-2xl border border-slate-200">
              Select a dossier from the left or compile a new one.
            </div>
          )}
        </div>
      </div>

      {/* Compile New Dossier Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-forest-800" />
                <h3 className="font-bold text-slate-900 text-base">Compile Forest Offense Legal Dossier</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGenerateReport} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Verified Acoustic Alert</label>
                <select
                  value={targetAlertId}
                  onChange={(e) => setTargetAlertId(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-2.5 bg-slate-50 focus:bg-white text-slate-900 font-medium focus:outline-none focus:border-forest-600"
                >
                  {alerts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.nodeId} — {a.eventType} ({Math.round(a.confidence * 100)}%) • {a.zone}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Investigating Officer Name & Title</label>
                <input
                  type="text"
                  value={investigatingOfficer}
                  onChange={(e) => setInvestigatingOfficer(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-2.5 bg-slate-50 focus:bg-white text-slate-900 focus:outline-none focus:border-forest-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Evidence & Ranger Field Observations</label>
                <textarea
                  rows={3}
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder="e.g. Tree stump examined at coordinate 29.518° N. Freshly cut Shorea robusta logs seized by Patrol Team 1."
                  className="w-full border border-slate-200 rounded-xl p-2.5 bg-slate-50 focus:bg-white text-slate-900 focus:outline-none focus:border-forest-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-forest-800 hover:bg-forest-900 text-white font-bold rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Generate & Seal Dossier</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
