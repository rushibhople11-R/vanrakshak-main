import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { mockStorage } from '../services/mockStorage';
import { SensorNode, Alert, SystemMetrics } from '../types';
import { StatCard } from '../components/common/StatCard';
import { ZoneGridMap } from '../components/dashboard/ZoneGridMap';
import { SystemHealth } from '../components/dashboard/SystemHealth';
import { AlertTable } from '../components/alerts/AlertTable';
import { VerificationModal } from '../components/alerts/VerificationModal';
import { SimulationModal } from '../components/dashboard/SimulationModal';
import {
  Cpu,
  Bell,
  Clock,
  Radio,
  Sparkles,
  TreePine,
  ArrowRight,
  ShieldCheck,
  Zap,
  Users,
  Compass,
  Volume2,
  Scale,
  UserPlus,
  UserCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

interface OverviewPageProps {
  onOpenAuth?: (tab?: 'register' | 'login') => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({ onOpenAuth }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [nodes, setNodes] = useState<SensorNode[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Verification modal state
  const [selectedAlertForVerify, setSelectedAlertForVerify] = useState<Alert | null>(null);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

  // Simulation modal state
  const [isSimulationOpen, setIsSimulationOpen] = useState(false);

  // Filters for the embedded table
  const [filterEvent, setFilterEvent] = useState('all');
  const [filterZone, setFilterZone] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const loadData = async () => {
    try {
      const [nodesData, alertsData, metricsData] = await Promise.all([
        api.getNodes(),
        api.getAlerts(),
        api.getMetrics(),
      ]);
      setNodes(nodesData && nodesData.length > 0 ? nodesData : mockStorage.getNodes());
      setAlerts(alertsData && alertsData.length > 0 ? alertsData : mockStorage.getAlerts());
      setMetrics(metricsData || mockStorage.getMetrics());
    } catch (e) {
      setNodes(mockStorage.getNodes());
      setAlerts(mockStorage.getAlerts());
      setMetrics(mockStorage.getMetrics());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleVerifyAction = async (alertId: string, action: string, note: string) => {
    await api.updateAlertStatus(alertId, action, note);
    await loadData();
  };

  const activeNodesCount = nodes.filter((n) => n.status === 'online').length;
  const pendingCount = alerts.filter((a) => a.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Top Banner with Quick Simulation Call to Action */}
      <div className="bg-gradient-to-r from-forest-800 via-forest-700 to-tealbrand-700 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-white font-semibold text-[11px] backdrop-blur-xs">
              AI for Climate Change Hackathon
            </span>
            <span className="px-2 py-0.5 rounded-full bg-tealbrand-400/20 text-tealbrand-200 text-[11px] border border-tealbrand-400/30">
              India WPC IN865 Telemetry
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight">
            {t.bannerTitle}
          </h1>
          <p className="text-xs md:text-sm text-forest-100 max-w-2xl mt-1 leading-relaxed">
            {t.bannerDesc}
          </p>
        </div>

        <button
          onClick={() => setIsSimulationOpen(true)}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 active:scale-95 transition-all text-slate-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 flex-shrink-0"
        >
          <Sparkles className="w-4 h-4 text-slate-950" />
          <span>{t.simulateAlert}</span>
        </button>
      </div>

      {/* Ranger Operational Profile & Database Registration Card */}
      <div className="bg-white rounded-2xl p-5 border border-forest-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-forest-800 text-tealbrand-300 flex items-center justify-center font-black text-lg shadow-sm flex-shrink-0">
            {user?.name ? user.name.charAt(0) : 'R'}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900">{user?.name || 'Forest Officer'}</h2>
              <span className="px-2 py-0.5 rounded-full bg-forest-100 text-forest-800 text-[10px] font-bold">
                {user?.badgeNumber || 'MH-FR-2024-089'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-1.5">
              <span>Mobile:</span>
              <strong className="text-slate-800 font-semibold">{user?.mobileNumber || '+91 98201 44521'}</strong>
              <span className="text-slate-300">•</span>
              <span>{user?.division || 'Tadoba-Andhari Tiger Reserve'}</span>
              <span className="text-slate-300">•</span>
              <span className="text-forest-700 font-medium">{user?.beat || 'Moharli Core Beat'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            type="button"
            onClick={() => onOpenAuth ? onOpenAuth('register') : null}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
            title="Register a new officer"
          >
            <UserPlus className="w-4 h-4 text-tealbrand-300" />
            <span>Register Officer</span>
          </button>
          <Link
            to="/profile"
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl border border-slate-200 hover:border-forest-300 bg-slate-50 hover:bg-forest-50/50 text-slate-700 hover:text-forest-900 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
            title="View digital ID badge and profile details"
          >
            <UserCheck className="w-4 h-4 text-forest-700" />
            <span>Profile & ID Card</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t.kpiActiveNodes}
          value={`${activeNodesCount} / ${nodes.length}`}
          subtitle={`${nodes.filter(n => n.solarCharging).length} ${t.kpiActiveNodesSub}`}
          icon={Cpu}
          variant="forest"
          badgeText="IN865 Band"
        />
        <StatCard
          title={t.kpiAlertsToday}
          value={alerts.length}
          subtitle={t.kpiAlertsTodaySub}
          icon={Bell}
          variant="warning"
          badgeText="Simulated"
        />
        <StatCard
          title={t.kpiPendingReview}
          value={pendingCount}
          subtitle={pendingCount > 0 ? t.kpiPendingReviewSub : "All alerts verified"}
          icon={Clock}
          variant={pendingCount > 0 ? 'danger' : 'forest'}
          badgeText={pendingCount > 0 ? 'Action Required' : 'All Clear'}
        />
        <StatCard
          title={t.kpiGatewayStatus}
          value="Synchronized"
          subtitle={t.kpiGatewayStatusSub}
          icon={Radio}
          variant="teal"
          badgeText="865.06 MHz"
        />
      </div>

      {/* Published App Segregated Operations Quick Hub */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          to="/patrols"
          className="p-3 bg-white hover:bg-forest-50/60 border border-slate-200 hover:border-forest-300 rounded-xl shadow-2xs flex items-center justify-between transition-all group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-forest-50 text-forest-800 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 group-hover:text-forest-900">{t.quickPatrols}</p>
              <p className="text-[10px] text-slate-500">{t.quickPatrolsSub}</p>
            </div>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-forest-700" />
        </Link>

        <Link
          to="/threat-radar"
          className="p-3 bg-white hover:bg-forest-50/60 border border-slate-200 hover:border-forest-300 rounded-xl shadow-2xs flex items-center justify-between transition-all group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 group-hover:text-forest-900">{t.quickThreatRadar}</p>
              <p className="text-[10px] text-slate-500">{t.quickThreatRadarSub}</p>
            </div>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-forest-700" />
        </Link>

        <Link
          to="/sound-studio"
          className="p-3 bg-white hover:bg-forest-50/60 border border-slate-200 hover:border-forest-300 rounded-xl shadow-2xs flex items-center justify-between transition-all group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-tealbrand-50 text-tealbrand-700 flex items-center justify-center font-bold">
              <Volume2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 group-hover:text-forest-900">{t.quickSoundStudio}</p>
              <p className="text-[10px] text-slate-500">{t.quickSoundStudioSub}</p>
            </div>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-forest-700" />
        </Link>

        <Link
          to="/reports"
          className="p-3 bg-white hover:bg-forest-50/60 border border-slate-200 hover:border-forest-300 rounded-xl shadow-2xs flex items-center justify-between transition-all group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 group-hover:text-forest-900">{t.quickDossiers}</p>
              <p className="text-[10px] text-slate-500">{t.quickDossiersSub}</p>
            </div>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-forest-700" />
        </Link>
      </div>

      {/* Forest Zones Interactive Grid Map */}
      <ZoneGridMap nodes={nodes} alerts={alerts} />

      {/* System Health Widget */}
      <SystemHealth nodes={nodes} metrics={metrics} />

      {/* Recent Alerts Queue Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Bell className="w-4 h-4 text-forest-800" />
              <span>{t.recentAlertsQueue}</span>
            </h3>
            <p className="text-xs text-slate-500">
              {t.recentAlertsQueueSub}
            </p>
          </div>
          <Link
            to="/alerts"
            className="text-xs font-semibold text-forest-800 hover:text-forest-900 flex items-center gap-1 hover:underline"
          >
            <span>{t.viewAllAlerts}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <AlertTable
          alerts={alerts.slice(0, 5)}
          onOpenVerification={(alert) => {
            setSelectedAlertForVerify(alert);
            setIsVerificationModalOpen(true);
          }}
          filterEvent={filterEvent}
          setFilterEvent={setFilterEvent}
          filterZone={filterZone}
          setFilterZone={setFilterZone}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
        />
      </div>

      {/* Climate & Biodiversity Impact Summary */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <TreePine className="w-5 h-5 text-forest-700" />
            <h3 className="font-bold text-slate-900 text-sm">{t.impactSummaryTitle}</h3>
          </div>
          <Link
            to="/impact"
            className="text-xs font-semibold text-tealbrand-700 hover:text-tealbrand-800 flex items-center gap-1"
          >
            <span>Detailed Analysis</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-forest-50/60 border border-forest-100">
            <div className="font-bold text-forest-900 flex items-center gap-1.5 mb-1">
              <Zap className="w-4 h-4 text-forest-700" />
              <span>{t.impactBox1Title}</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              {t.impactBox1Desc}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-tealbrand-50/60 border border-tealbrand-100">
            <div className="font-bold text-tealbrand-900 flex items-center gap-1.5 mb-1">
              <Radio className="w-4 h-4 text-tealbrand-700" />
              <span>{t.impactBox2Title}</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              {t.impactBox2Desc}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200">
            <div className="font-bold text-amber-950 flex items-center gap-1.5 mb-1">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>{t.impactBox3Title}</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              {t.impactBox3Desc}
            </p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <VerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => {
          setIsVerificationModalOpen(false);
          setSelectedAlertForVerify(null);
        }}
        alert={selectedAlertForVerify}
        onVerify={handleVerifyAction}
      />

      <SimulationModal
        isOpen={isSimulationOpen}
        onClose={() => setIsSimulationOpen(false)}
        nodes={nodes}
        onSimulationComplete={loadData}
      />
    </div>
  );
};
