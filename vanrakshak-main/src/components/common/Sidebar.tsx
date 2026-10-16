import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Bell,
  Cpu,
  Activity,
  Network,
  TreePine,
  BookOpen,
  Radio,
  FileCode2,
  Users,
  Compass,
  Volume2,
  Scale,
  UserCheck,
  UserPlus,
  LogOut,
} from 'lucide-react';

interface SidebarProps {
  pendingAlertCount?: number;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  pendingAlertCount = 0,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const { t } = useLanguage();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const navSections = [
    {
      category: t.navCoreMonitoring,
      items: [
        {
          to: '/',
          label: t.navOverview,
          icon: LayoutDashboard,
        },
        {
          to: '/alerts',
          label: t.navLiveAlerts,
          icon: Bell,
          badge: pendingAlertCount > 0 ? pendingAlertCount : null,
        },
        {
          to: '/threat-radar',
          label: t.navThreatRadar,
          icon: Compass,
        },
      ],
    },
    {
      category: t.navFieldOperations,
      items: [
        {
          to: '/patrols',
          label: t.navPatrols,
          icon: Users,
        },
        {
          to: '/profile',
          label: t.navProfile,
          icon: UserCheck,
        },
      ],
    },
    {
      category: t.navEdgeAiAcoustics,
      items: [
        {
          to: '/sound-analysis',
          label: t.navSoundAnalysis,
          icon: Activity,
        },
        {
          to: '/sound-studio',
          label: t.navSoundStudio,
          icon: Volume2,
        },
      ],
    },
    {
      category: t.navMeshTelemetry,
      items: [
        {
          to: '/nodes',
          label: t.navNodes,
          icon: Cpu,
        },
        {
          to: '/telemetry',
          label: t.navRfTelemetry,
          icon: Radio,
        },
      ],
    },
    {
      category: t.navSecurityImpact,
      items: [
        {
          to: '/reports',
          label: t.navReports,
          icon: Scale,
        },
        {
          to: '/impact',
          label: t.navClimateImpact,
          icon: TreePine,
        },
        {
          to: '/architecture',
          label: t.navArchitecture,
          icon: Network,
        },
        {
          to: '/project-info',
          label: t.navProjectInfo,
          icon: BookOpen,
        },
      ],
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 w-64 select-none">
      {/* Navigation Links */}
      <div className="flex-1 py-3 px-3 space-y-4 overflow-y-auto">
        {navSections.map((section) => (
          <div key={section.category} className="space-y-1">
            <div className="px-3 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {section.category}
            </div>
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-forest-50 text-forest-800 font-semibold shadow-xs border-l-4 border-forest-800'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className="w-4 h-4 flex-shrink-0 text-slate-500 group-hover:text-slate-900" />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-alert-red text-white shadow-xs animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}

        <div className="pt-2">
          <div className="p-3 bg-tealbrand-50/60 rounded-xl border border-tealbrand-100 text-xs text-tealbrand-900">
            <div className="flex items-center gap-1.5 font-semibold text-tealbrand-900 mb-1">
              <Radio className="w-3.5 h-3.5 text-tealbrand-700" />
              <span>LoRa IN865 Telemetry</span>
            </div>
            <p className="text-[11px] text-tealbrand-800 leading-relaxed">
              Sub-GHz RF channel 865.0625 MHz configured for low-power edge alerts under Indian WPC rules.
            </p>
            <div className="mt-2 text-[10px] text-tealbrand-700 font-mono flex items-center gap-1">
              <FileCode2 className="w-3 h-3" />
              <span>POST /api/ingest/alert</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer info & Account / Sign Out status */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/70 space-y-2">
        {isAuthenticated && user ? (
          <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <div
              className="flex items-center gap-2 truncate cursor-pointer"
              onClick={() => {
                if (onCloseMobile) onCloseMobile();
                navigate('/profile');
              }}
              title="View Officer Profile"
            >
              <div className="w-7 h-7 rounded-lg bg-forest-800 text-tealbrand-300 font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
                {user.name ? user.name.charAt(0) : 'R'}
              </div>
              <div className="truncate">
                <p className="text-[11px] font-bold text-slate-900 truncate leading-tight">{user.name}</p>
                <p className="text-[9px] text-slate-500 capitalize truncate">{user.role}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={async () => {
                if (onCloseMobile) onCloseMobile();
                await logout();
                navigate('/');
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer flex-shrink-0"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200">
            <span className="text-[11px] text-slate-500 font-medium">Guest Mode</span>
            <button
              onClick={() => {
                if (onCloseMobile) onCloseMobile();
                navigate('/login');
              }}
              className="text-[11px] text-forest-700 hover:text-forest-900 font-bold flex items-center gap-1 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          </div>
        )}

        <div className="text-[10px] text-slate-400 flex items-center justify-between px-1">
          <p className="font-semibold text-slate-600">VanRakshak v1.0</p>
          <span className="text-emerald-600 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Online</span>
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block h-[calc(100vh-4rem)] sticky top-16 flex-shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="relative z-50 w-64 max-w-[80%] h-full">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
