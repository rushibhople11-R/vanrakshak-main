import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  LayoutDashboard,
  Bell,
  Cpu,
  Activity,
  Users,
  Compass,
  Radio,
  Scale,
  TreePine,
  Network,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { api } from '../../services/api';
import { SensorNode, Alert } from '../../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [nodes, setNodes] = useState<SensorNode[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      api.getNodes().then(setNodes);
      api.getAlerts().then(setAlerts);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickNav = [
    { label: 'Overview Dashboard', path: '/', icon: LayoutDashboard, category: 'Navigation' },
    { label: 'Live Alerts Queue', path: '/alerts', icon: Bell, category: 'Navigation' },
    { label: 'Patrol Dispatch & Field Operations', path: '/patrols', icon: Users, category: 'Navigation' },
    { label: 'Acoustic Threat Studio & Synth Lab', path: '/sound-studio', icon: Activity, category: 'Navigation' },
    { label: 'LoRa IN865 Mesh Telemetry', path: '/telemetry', icon: Radio, category: 'Navigation' },
    { label: 'Threat Radar & Risk Forecasting', path: '/threat-radar', icon: Compass, category: 'Navigation' },
    { label: 'Forest Offense Evidence Dossiers', path: '/reports', icon: Scale, category: 'Navigation' },
    { label: 'Sensor Nodes Fleet', path: '/nodes', icon: Cpu, category: 'Navigation' },
    { label: 'Sound Analysis & Edge-AI', path: '/sound-analysis', icon: Activity, category: 'Navigation' },
    { label: 'System Architecture', path: '/architecture', icon: Network, category: 'Navigation' },
    { label: 'Climate & Biodiversity Impact', path: '/impact', icon: TreePine, category: 'Navigation' },
    { label: 'Project Information', path: '/project-info', icon: BookOpen, category: 'Navigation' },
  ];

  const filteredNav = quickNav.filter((n) =>
    n.label.toLowerCase().includes(query.toLowerCase())
  );

  const filteredNodes = nodes.filter(
    (n) =>
      n.nodeId.toLowerCase().includes(query.toLowerCase()) ||
      n.name.toLowerCase().includes(query.toLowerCase()) ||
      n.zone.toLowerCase().includes(query.toLowerCase())
  );

  const filteredAlerts = alerts.filter(
    (a) =>
      a.nodeId.toLowerCase().includes(query.toLowerCase()) ||
      a.eventType.toLowerCase().includes(query.toLowerCase()) ||
      a.zone.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
    setQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/40 backdrop-blur-xs">
      <div
        className="fixed inset-0"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in fade-in duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 gap-3">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, node (e.g. VR-01), alert, or page..."
            className="w-full text-xs text-slate-900 placeholder-slate-400 focus:outline-none bg-transparent"
          />
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 rounded border border-slate-200">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 text-xs divide-y divide-slate-100">
          {/* Quick Navigation Pages */}
          {filteredNav.length > 0 && (
            <div className="pb-2">
              <p className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                System Pages
              </p>
              {filteredNav.slice(0, 6).map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleSelect(item.path)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-forest-50/80 hover:text-forest-900 text-slate-700 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-slate-400 group-hover:text-forest-700" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-forest-700" />
                  </button>
                );
              })}
            </div>
          )}

          {/* Sensor Nodes */}
          {filteredNodes.length > 0 && (
            <div className="py-2">
              <p className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Sensor Nodes
              </p>
              {filteredNodes.slice(0, 4).map((node) => (
                <button
                  key={node.nodeId}
                  onClick={() => handleSelect('/nodes')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-forest-50/80 hover:text-forest-900 text-slate-700 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <Cpu className="w-4 h-4 text-slate-400 group-hover:text-forest-700" />
                    <div>
                      <span className="font-bold text-forest-900">{node.nodeId}</span>
                      <span className="text-slate-500 ml-2 font-normal">{node.name}</span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                    {node.zone} • {node.batteryPercentage}%
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Acoustic Alerts */}
          {filteredAlerts.length > 0 && (
            <div className="py-2">
              <p className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Recent Alerts
              </p>
              {filteredAlerts.slice(0, 4).map((alert) => (
                <button
                  key={alert.id}
                  onClick={() => handleSelect(`/alerts/${alert.id}`)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-forest-50/80 hover:text-forest-900 text-slate-700 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <Bell className="w-4 h-4 text-alert-red" />
                    <div>
                      <span className="font-bold text-slate-900">{alert.nodeId}</span>
                      <span className="text-slate-500 ml-2 font-medium capitalize">
                        {alert.eventType.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-amber-700 font-bold">
                    {Math.round(alert.confidence * 100)}% Conf
                  </span>
                </button>
              ))}
            </div>
          )}

          {filteredNav.length === 0 && filteredNodes.length === 0 && filteredAlerts.length === 0 && (
            <div className="p-8 text-center text-slate-400 text-xs">
              No matching nodes, alerts, or system pages found for "{query}".
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Navigation Quick-Jump</span>
          <span>Press ESC to dismiss</span>
        </div>
      </div>
    </div>
  );
};
