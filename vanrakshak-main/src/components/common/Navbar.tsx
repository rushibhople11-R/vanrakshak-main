import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Radio, Sparkles, User, ChevronDown, Menu, X, Check, Search, Globe, Volume2, UserCheck, UserPlus, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { UserRole } from '../../types';
import { CommandPalette } from './CommandPalette';

interface NavbarProps {
  onOpenSimulation: () => void;
  onToggleMobileSidebar: () => void;
  isMobileSidebarOpen: boolean;
  onOpenAuth?: (tab?: 'register' | 'login') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSimulation,
  onToggleMobileSidebar,
  isMobileSidebarOpen,
  onOpenAuth,
}) => {
  const navigate = useNavigate();
  const { user, role, switchRole, logout, isAuthenticated } = useAuth();
  const { language, setLanguage, t, setIsWelcomeOpen, playVoiceGreeting, stopVoiceGreeting, isSpeaking } = useLanguage();
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  const roleOptions: { role: UserRole; label: string; title: string }[] = [
    { role: 'ranger', label: 'Field Patrol & Threat Response', title: 'Forest Ranger' },
    { role: 'admin', label: 'Division Management & Analytics', title: 'Division Admin' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileSidebar}
            aria-label="Toggle navigation menu"
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
          >
            {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-forest-800 flex items-center justify-center shadow-md shadow-forest-900/10 text-white">
              <Shield className="w-5 h-5 text-tealbrand-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-forest-900">VanRakshak</span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-forest-100 text-forest-800 font-semibold">वनरक्षक</span>
              </div>
              <p className="text-[10px] text-slate-500 hidden sm:block">Acoustic Edge-AI Forest Protection</p>
            </div>
          </div>
        </div>

        {/* Center: LoRa Gateway Status Indicator */}
        <div className="hidden lg:flex items-center gap-4 text-xs bg-slate-50 px-3.5 py-1.5 rounded-full border border-slate-200">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-slate-700">LoRa Gateway Active</span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-1.5 text-slate-600">
            <Radio className="w-3.5 h-3.5 text-tealbrand-500" />
            <span>IN865 (865.06 MHz) • WPC Compliant</span>
          </div>
        </div>

        {/* Right: Search, Language Switcher, Simulation Button & Role Selector */}
        <div className="flex items-center gap-2">
          {/* Quick Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs text-slate-500 font-medium transition-colors shadow-2xs"
            title="Search nodes, alerts, and pages (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden md:inline">Search...</span>
            <kbd className="hidden md:inline-block px-1.5 py-0.2 bg-white rounded border border-slate-200 text-[10px] font-mono text-slate-400">
              Ctrl K
            </kbd>
          </button>

          {/* 3-Language Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-forest-400 bg-white hover:bg-forest-50/50 text-xs font-bold text-slate-700 shadow-2xs transition-colors"
              title={t.switchLanguage}
            >
              <Globe className="w-3.5 h-3.5 text-forest-700" />
              <span>
                {language === 'hi' ? 'हिंदी' : language === 'mr' ? 'मराठी' : 'English'}
              </span>
              {isSpeaking && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              )}
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isLangDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Language / भाषा निवडा
                  </span>
                  <Volume2 className="w-3.5 h-3.5 text-forest-700" />
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setLanguage('en');
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors ${
                      language === 'en'
                        ? 'bg-forest-50 text-forest-900 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <p className="font-semibold">English</p>
                    </div>
                    {language === 'en' && <Check className="w-4 h-4 text-forest-700" />}
                  </button>

                  <button
                    onClick={() => {
                      setLanguage('hi');
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors ${
                      language === 'hi'
                        ? 'bg-forest-50 text-forest-900 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <p className="font-semibold">हिंदी (Hindi)</p>
                    </div>
                    {language === 'hi' && <Check className="w-4 h-4 text-forest-700" />}
                  </button>

                  <button
                    onClick={() => {
                      setLanguage('mr');
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors ${
                      language === 'mr'
                        ? 'bg-forest-50 text-forest-900 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <p className="font-semibold">मराठी (Marathi)</p>
                    </div>
                    {language === 'mr' && <Check className="w-4 h-4 text-forest-700" />}
                  </button>
                </div>

                <div className="border-t border-slate-100 pt-1.5 px-2">
                  <button
                    onClick={() => {
                      setIsWelcomeOpen(true);
                      setIsLangDropdownOpen(false);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-forest-50 hover:bg-forest-100 text-forest-800 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-forest-700" />
                    <span>Open AI Voice Gateway</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Register / Sign In CTA Button */}
          {isAuthenticated ? (
            <button
              onClick={() => onOpenAuth ? onOpenAuth('register') : navigate('/login')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-forest-800 hover:bg-forest-900 active:scale-95 transition-all text-white font-bold text-xs rounded-lg shadow-sm shadow-forest-900/10 cursor-pointer"
              title="Register New Ranger"
            >
              <UserPlus className="w-3.5 h-3.5 text-tealbrand-300" />
              <span className="hidden sm:inline">Register New Ranger</span>
              <span className="sm:hidden">Register</span>
            </button>
          ) : (
            <button
              onClick={() => onOpenAuth ? onOpenAuth('login') : navigate('/login')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-forest-800 hover:bg-forest-900 active:scale-95 transition-all text-white font-bold text-xs rounded-lg shadow-sm shadow-forest-900/10 cursor-pointer"
              title="Sign In or Register"
            >
              <UserCheck className="w-3.5 h-3.5 text-tealbrand-300" />
              <span className="hidden sm:inline">Sign In / Register</span>
              <span className="sm:hidden">Sign In</span>
            </button>
          )}

          {/* Quick Sign Out Button in Header */}
          {isAuthenticated && (
            <button
              onClick={async () => {
                await logout();
                navigate('/');
              }}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-rose-300 bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 font-bold text-xs shadow-2xs transition-all cursor-pointer"
              title="Sign Out of VanRakshak session"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-500" />
              <span className="hidden md:inline">Sign Out</span>
            </button>
          )}

          <button
            onClick={onOpenSimulation}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 active:scale-95 transition-all text-white font-medium text-xs rounded-lg shadow-sm shadow-amber-500/20"
            title="Trigger synthetic acoustic chainsaw alert"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">{t.simulateAlert}</span>
            <span className="sm:hidden">Simulate</span>
          </button>

          {/* Role switcher dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center gap-2 pl-2.5 pr-2 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white text-xs font-medium text-slate-700 shadow-sm focus:outline-none cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-forest-100 text-forest-800 flex items-center justify-center font-bold text-[11px]">
                {user?.name ? user.name.charAt(0) : isAuthenticated ? 'R' : '?'}
              </div>
              <div className="text-left hidden md:block">
                <p className="text-[11px] font-bold text-forest-900 leading-tight">
                  {isAuthenticated ? (user?.name || 'Ranger') : 'Signed Out'}
                </p>
                <p className="text-[10px] text-slate-500 capitalize">
                  {isAuthenticated ? `${role} role` : 'Guest Mode'}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isRoleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {isAuthenticated ? (
                  <>
                    {/* Profile & ID Dashboard Link */}
                    <div className="p-2 border-b border-slate-100 bg-slate-50/70">
                      <button
                        onClick={() => {
                          navigate('/profile');
                          setIsRoleDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-lg bg-forest-800 hover:bg-forest-900 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <UserCheck className="w-4 h-4 text-tealbrand-300" />
                          <span>Ranger Profile & ID Card</span>
                        </div>
                      </button>
                    </div>

                    <div className="px-3 py-1.5 border-b border-slate-100 flex items-center justify-between">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Switch Role</p>
                      <button
                        onClick={() => {
                          if (onOpenAuth) {
                            onOpenAuth('register');
                          } else {
                            navigate('/login');
                          }
                          setIsRoleDropdownOpen(false);
                        }}
                        className="text-[10px] text-forest-700 hover:text-forest-900 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <UserPlus className="w-3 h-3" />
                        <span>Register Ranger</span>
                      </button>
                    </div>
                    {roleOptions.map((opt) => (
                      <button
                        key={opt.role}
                        onClick={() => {
                          switchRole(opt.role);
                          setIsRoleDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs hover:bg-slate-50 transition-colors ${
                          role === opt.role ? 'bg-forest-50/70 text-forest-900 font-semibold' : 'text-slate-700'
                        }`}
                      >
                        <div>
                          <p className="font-medium">{opt.title}</p>
                          <p className="text-[10px] text-slate-500">{opt.label}</p>
                        </div>
                        {role === opt.role && <Check className="w-4 h-4 text-forest-700" />}
                      </button>
                    ))}

                    {/* Prominent Sign Out Option in Dropdown */}
                    <div className="pt-2 mt-1 border-t border-slate-100 px-2">
                      <button
                        type="button"
                        onClick={async () => {
                          setIsRoleDropdownOpen(false);
                          await logout();
                          navigate('/');
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <LogOut className="w-4 h-4 text-rose-500" />
                          <span>Sign Out</span>
                        </div>
                        <span className="text-[10px] text-rose-400 font-normal">End Session</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="p-3 space-y-2">
                    <div className="text-center pb-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-800">You are Signed Out</p>
                      <p className="text-[10px] text-slate-500">Sign in to access your Ranger credentials</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsRoleDropdownOpen(false);
                        if (onOpenAuth) onOpenAuth('login');
                        else navigate('/login');
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs shadow-xs cursor-pointer"
                    >
                      <UserCheck className="w-4 h-4 text-tealbrand-300" />
                      <span>Sign In as Officer</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsRoleDropdownOpen(false);
                        if (onOpenAuth) onOpenAuth('register');
                        else navigate('/login');
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs cursor-pointer"
                    >
                      <UserPlus className="w-4 h-4 text-forest-700" />
                      <span>Register New Officer</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Universal Search Command Palette */}
      <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
};
