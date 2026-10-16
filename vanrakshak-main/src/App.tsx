import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DemoBadge } from './components/common/DemoBadge';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { SimulationModal } from './components/dashboard/SimulationModal';
import { OverviewPage } from './pages/OverviewPage';
import { LiveAlertsPage } from './pages/LiveAlertsPage';
import { AlertDetailPage } from './pages/AlertDetailPage';
import { NodesPage } from './pages/NodesPage';
import { SoundAnalysisPage } from './pages/SoundAnalysisPage';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { ImpactPage } from './pages/ImpactPage';
import { ProjectInfoPage } from './pages/ProjectInfoPage';
import { LoginPage } from './pages/LoginPage';
import { PatrolDispatchPage } from './pages/PatrolDispatchPage';
import { SoundStudioPage } from './pages/SoundStudioPage';
import { RfTelemetryPage } from './pages/RfTelemetryPage';
import { ThreatRadarPage } from './pages/ThreatRadarPage';
import { EvidenceReportsPage } from './pages/EvidenceReportsPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { api } from './services/api';
import { mockStorage } from './services/mockStorage';
import { SensorNode } from './types';

import { LanguageProvider } from './context/LanguageContext';
import { WelcomeLanguageModal } from './components/common/WelcomeLanguageModal';
import { AuthModal } from './components/auth/AuthModal';

export const AppContent: React.FC = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSimulationOpen, setIsSimulationOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'register' | 'login'>('register');
  const [nodes, setNodes] = useState<SensorNode[]>(mockStorage.getNodes());
  const [pendingAlertCount, setPendingAlertCount] = useState(1);

  const openAuth = (tab: 'register' | 'login' = 'register') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const fetchGlobalStats = async () => {
    try {
      const [nodesData, alertsData] = await Promise.all([
        api.getNodes(),
        api.getAlerts({ status: 'pending' }),
      ]);
      setNodes(nodesData && nodesData.length > 0 ? nodesData : mockStorage.getNodes());
      setPendingAlertCount(alertsData ? alertsData.length : 1);
    } catch (e) {
      setNodes(mockStorage.getNodes());
      setPendingAlertCount(1);
    }
  };

  useEffect(() => {
    fetchGlobalStats();
    const timer = setInterval(fetchGlobalStats, 20000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1. Persistent Mandatory Prototype Demo Banner */}
      <DemoBadge />

      {/* 2. Top Header Navbar */}
      <Navbar
        onOpenSimulation={() => setIsSimulationOpen(true)}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        isMobileSidebarOpen={isMobileSidebarOpen}
        onOpenAuth={openAuth}
      />

      {/* 3. Main Body: Sidebar + Page Container */}
      <div className="flex flex-1">
        <Sidebar
          pendingAlertCount={pendingAlertCount}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          <Routes>
            <Route path="/" element={<OverviewPage onOpenAuth={openAuth} />} />
            <Route path="/alerts" element={<LiveAlertsPage />} />
            <Route path="/alerts/:id" element={<AlertDetailPage />} />
            <Route path="/patrols" element={<PatrolDispatchPage />} />
            <Route path="/nodes" element={<NodesPage />} />
            <Route path="/telemetry" element={<RfTelemetryPage />} />
            <Route path="/threat-radar" element={<ThreatRadarPage />} />
            <Route path="/sound-analysis" element={<SoundAnalysisPage />} />
            <Route path="/sound-studio" element={<SoundStudioPage />} />
            <Route path="/reports" element={<EvidenceReportsPage />} />
            <Route path="/architecture" element={<ArchitecturePage />} />
            <Route path="/impact" element={<ImpactPage />} />
            <Route path="/project-info" element={<ProjectInfoPage />} />
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {/* Global Simulation Modal */}
      <SimulationModal
        isOpen={isSimulationOpen}
        onClose={() => setIsSimulationOpen(false)}
        nodes={nodes}
        onSimulationComplete={fetchGlobalStats}
      />

      {/* Startup Language Selection & AI Voice Assistant Modal */}
      <WelcomeLanguageModal
        onComplete={() => {
          if (!localStorage.getItem('vr_token')) {
            openAuth('register');
          }
        }}
      />

      {/* Ranger Registration & Access Dashboard Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultTab={authModalTab}
        onSuccess={fetchGlobalStats}
      />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}
