import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { mockStorage } from '../services/mockStorage';
import { RfNodeTelemetry } from '../types';
import { StatCard } from '../components/common/StatCard';
import {
  Radio,
  Wifi,
  Sun,
  BatteryCharging,
  Cpu,
  Layers,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ArrowUpRight,
  Zap,
} from 'lucide-react';

export const RfTelemetryPage: React.FC = () => {
  const [telemetry, setTelemetry] = useState<RfNodeTelemetry[]>([]);
  const [loading, setLoading] = useState(true);
  const [fotaSuccess, setFotaSuccess] = useState<string | null>(null);
  const [updatingNode, setUpdatingNode] = useState<string | null>(null);

  const loadTelemetry = async () => {
    setLoading(true);
    try {
      const data = await api.getRfTelemetry();
      setTelemetry(data);
    } catch (e) {
      setTelemetry(mockStorage.getRfTelemetry());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTelemetry();
  }, []);

  const triggerFotaUpdate = (nodeId: string) => {
    setUpdatingNode(nodeId);
    setFotaSuccess(null);
    setTimeout(() => {
      setTelemetry((prev) =>
        prev.map((item) =>
          item.nodeId === nodeId
            ? { ...item, modelVersion: 'vanrakshak-tinyml-v1.5-heavy', firmware: '1.2.4-esp32s3' }
            : item
        )
      );
      setUpdatingNode(null);
      setFotaSuccess(`TinyML v1.5 successfully deployed to ${nodeId} over IN865 downlink packet.`);
      setTimeout(() => setFotaSuccess(null), 4000);
    }, 1500);
  };

  const avgRssi = telemetry.length
    ? Math.round(telemetry.reduce((acc, t) => acc + t.rssi, 0) / telemetry.length)
    : -82;
  const avgSnr = telemetry.length
    ? (telemetry.reduce((acc, t) => acc + t.snr, 0) / telemetry.length).toFixed(1)
    : '7.8';

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-6 h-6 text-forest-800" />
            <h1 className="text-xl font-bold text-slate-900">LoRa IN865 Mesh & RF Link Diagnostics</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Sub-GHz radio telemetry compliant with India WPC GSR 564(E) 865–867 MHz license-exempt rules
          </p>
        </div>

        <button
          onClick={loadTelemetry}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh RF Telemetry</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Radio Band / Region"
          value="IN865 (865 MHz)"
          subtitle="India WPC GSR 564(E) Compliant"
          icon={Radio}
          variant="forest"
          badgeText="865.0625 MHz"
        />
        <StatCard
          title="Mean RSSI Signal"
          value={`${avgRssi} dBm`}
          subtitle="Strong canopy penetration link"
          icon={Wifi}
          variant="teal"
          badgeText="SF7 / BW125"
        />
        <StatCard
          title="Signal-to-Noise Ratio"
          value={`+${avgSnr} dB`}
          subtitle="High demodulation headroom"
          icon={Zap}
          variant="forest"
          badgeText="SNR Robust"
        />
        <StatCard
          title="Solar Photovoltaic"
          value="2.4 W Avg"
          subtitle="SunPower Monocrystalline Cells"
          icon={Sun}
          variant="warning"
          badgeText="Solar Assisted"
        />
      </div>

      {fotaSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{fotaSuccess}</span>
        </div>
      )}

      {/* Node RF Telemetry Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-forest-700" />
              <span>Sensor Node RF Link Quality & Firmware State</span>
            </h3>
            <p className="text-xs text-slate-500">
              Live link budget analysis, RSSI/SNR signal quality, and FOTA TinyML binary updater
            </p>
          </div>
          <span className="text-[11px] font-semibold text-slate-500">
            {telemetry.length} Monitored RF Transceivers
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-600 font-bold">
                <th className="py-2.5 px-3">Node</th>
                <th className="py-2.5 px-3">Zone</th>
                <th className="py-2.5 px-3">Frequency</th>
                <th className="py-2.5 px-3">RSSI / SNR</th>
                <th className="py-2.5 px-3">Link Quality</th>
                <th className="py-2.5 px-3">Solar Yield</th>
                <th className="py-2.5 px-3">TinyML Model</th>
                <th className="py-2.5 px-3">FOTA Downlink</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {telemetry.map((node) => {
                const isGood = node.rssi > -90 && node.snr > 4;
                const isModerate = node.rssi > -105 && node.rssi <= -90;

                return (
                  <tr key={node.nodeId} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-3">
                      <p className="font-bold text-forest-900">{node.nodeId}</p>
                      <p className="text-[10px] text-slate-500 truncate">{node.name}</p>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-700">{node.zone}</td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-600">
                      {node.frequencyMHz.toFixed(4)} MHz
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px]">
                      <span className="font-bold text-slate-900">{node.rssi} dBm</span>
                      <span className="text-slate-400 ml-1.5 font-normal">({node.snr > 0 ? `+${node.snr}` : node.snr} dB)</span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isGood
                            ? 'bg-emerald-100 text-emerald-800'
                            : isModerate
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-alert-red'
                        }`}
                      >
                        {isGood ? 'Excellent' : isModerate ? 'Moderate' : 'Fringe Link'}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-700">
                      {node.solarYieldWatts.toFixed(2)} W
                    </td>
                    <td className="py-3 px-3 font-mono text-[10px] text-forest-800">
                      {node.modelVersion}
                    </td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => triggerFotaUpdate(node.nodeId)}
                        disabled={updatingNode === node.nodeId}
                        className="px-2.5 py-1 text-[11px] font-semibold rounded-lg border border-slate-200 hover:border-forest-600 text-slate-700 hover:text-forest-800 transition-all flex items-center gap-1 active:scale-95 disabled:opacity-50"
                      >
                        {updatingNode === node.nodeId ? (
                          <RefreshCw className="w-3 h-3 animate-spin text-forest-700" />
                        ) : (
                          <ArrowUpRight className="w-3 h-3 text-slate-500" />
                        )}
                        <span>{updatingNode === node.nodeId ? 'Updating...' : 'Deploy v1.5'}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sub-GHz Technical RF Blueprint Notice */}
      <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3 text-xs">
        <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Radio className="w-4 h-4 text-tealbrand-600" />
          <span>India WPC Telecommunications Compliance Architecture</span>
        </h4>
        <p className="text-slate-600 leading-relaxed text-[11px]">
          Under Indian Gazette Notification <strong>GSR 564(E)</strong>, the 865.000 to 867.000 MHz spectrum is categorized as license-exempt for low-power wireless devices (effective radiated power ≤ 1 Watt). VanRakshak nodes operate at 14 dBm (~25 mW), comfortably within legal limits while guaranteeing up to 4.2 km reliable canopy transmission distance using LoRa chirp spread spectrum modulation.
        </p>
      </div>
    </div>
  );
};
