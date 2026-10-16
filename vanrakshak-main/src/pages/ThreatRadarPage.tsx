import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { mockStorage } from '../services/mockStorage';
import { ThreatForecastZone } from '../types';
import { StatCard } from '../components/common/StatCard';
import {
  Compass,
  AlertTriangle,
  Flame,
  ShieldCheck,
  TreePine,
  Clock,
  MapPin,
  TrendingUp,
  RefreshCw,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ThreatRadarPage: React.FC = () => {
  const [zones, setZones] = useState<ThreatForecastZone[]>([]);
  const [loading, setLoading] = useState(true);

  const loadZones = async () => {
    setLoading(true);
    try {
      const data = await api.getThreatForecastZones();
      setZones(data);
    } catch (e) {
      setZones(mockStorage.getThreatForecastZones());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadZones();
  }, []);

  const criticalCount = zones.filter((z) => z.riskLevel === 'CRITICAL' || z.riskLevel === 'HIGH').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-6 h-6 text-forest-800" />
            <h1 className="text-xl font-bold text-slate-900">Predictive Forest Threat Radar & Risk Forecasting</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Spatial vulnerability modeling combining acoustic history, road accessibility, and diurnal threat windows
          </p>
        </div>

        <button
          onClick={loadZones}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Recalculate Risk Matrix</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Monitored Forest Sectors"
          value="4 Zones"
          subtitle="1,240 Hectares Protected"
          icon={TreePine}
          variant="forest"
          badgeText="Active Mesh"
        />
        <StatCard
          title="High / Critical Sectors"
          value={`${criticalCount} Zones`}
          subtitle="Requires prioritized field deployment"
          icon={Flame}
          variant={criticalCount > 0 ? 'danger' : 'forest'}
          badgeText={criticalCount > 0 ? 'Elevated Threat' : 'Nominal'}
        />
        <StatCard
          title="Peak Threat Window"
          value="02:30 – 05:30"
          subtitle="Pre-dawn illegal cutting activity"
          icon={Clock}
          variant="warning"
          badgeText="Diurnal Risk"
        />
        <StatCard
          title="Preventive Patrols Recommended"
          value="6 Squads"
          subtitle="Tactical resource allocation"
          icon={Users}
          variant="teal"
          badgeText="QRF Ready"
        />
      </div>

      {/* Forest Sectors Risk Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-forest-700" />
              <span>Spatio-Temporal Threat Breakdown by Sector</span>
            </h3>
            <p className="text-xs text-slate-500">
              Evaluated vulnerability index factoring in terrain barriers, dry riverbeds, and illegal extraction routes
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {zones.map((zone) => {
            const isCritical = zone.riskLevel === 'CRITICAL';
            const isHigh = zone.riskLevel === 'HIGH';

            return (
              <div
                key={zone.zone}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4 hover:border-forest-300 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base text-slate-900">{zone.zone}: {zone.name}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{zone.canopyDensity}</p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      isCritical
                        ? 'bg-red-100 text-alert-red border border-red-200 animate-pulse'
                        : isHigh
                        ? 'bg-amber-100 text-amber-900 border border-amber-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {zone.riskLevel} Risk ({zone.riskScore}/100)
                  </span>
                </div>

                {/* Progress bar of risk */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                    <span>Threat Vulnerability Index</span>
                    <span>{zone.riskScore}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        isCritical
                          ? 'bg-alert-red'
                          : isHigh
                          ? 'bg-amber-500'
                          : 'bg-forest-500'
                      }`}
                      style={{ width: `${zone.riskScore}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Proximity to Trail/Road</span>
                    <span className="font-semibold text-slate-800">{zone.roadProximityKm} km</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Historical Alerts</span>
                    <span className="font-semibold text-slate-800">{zone.historicalIncidentsCount} detections</span>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-slate-200/60">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">High Vulnerability Window</span>
                    <span className="font-semibold text-forest-900 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-forest-700" />
                      <span>{zone.threatWindow}</span>
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                  {zone.statusSummary}
                </p>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                  <span className="font-semibold text-forest-800">
                    Recommended: {zone.recommendedPatrols} Patrol Squad{zone.recommendedPatrols > 1 ? 's' : ''}
                  </span>
                  <Link
                    to="/patrols"
                    className="text-xs font-bold text-tealbrand-700 hover:text-tealbrand-900 hover:underline"
                  >
                    Dispatch to {zone.zone} →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
