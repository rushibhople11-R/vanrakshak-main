import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { User } from '../types';
import { AuthModal } from '../components/auth/AuthModal';
import {
  Shield,
  User as UserIcon,
  Phone,
  Mail,
  Building2,
  MapPin,
  Award,
  CheckCircle2,
  QrCode,
  Radio,
  Clock,
  Edit3,
  Save,
  RotateCcw,
  UserPlus,
  Users,
  LogOut,
  AlertCircle,
  Sparkles,
  ExternalLink,
  Printer,
  ArrowLeft,
  X,
  UserCheck,
} from 'lucide-react';

export const UserProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateProfile, logout, role, isGuest, isAuthenticated } = useAuth();
  const { language } = useLanguage();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('register');
  const [registeredRangers, setRegisteredRangers] = useState<User[]>([]);
  const [dutyStatus, setDutyStatus] = useState<'on_duty' | 'standby' | 'off_duty'>('on_duty');

  // Edit Profile Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editMobile, setEditMobile] = useState(user?.mobileNumber || '+91 98201 44521');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [editDivision, setEditDivision] = useState(user?.division || 'Tadoba-Andhari Tiger Reserve');
  const [editBeat, setEditBeat] = useState(user?.beat || 'Moharli Core Beat');
  const [editEmergency, setEditEmergency] = useState(user?.emergencyContact || '+91 98201 44000 (Range HQ)');

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setEditName(user.name || '');
      setEditMobile(user.mobileNumber || '+91 98201 44521');
      setEditEmail(user.email || '');
      setEditDivision(user.division || 'Tadoba-Andhari Tiger Reserve');
      setEditBeat(user.beat || 'Moharli Core Beat');
      setEditEmergency(user.emergencyContact || '+91 98201 44000 (Range HQ)');
    }
  }, [user]);

  const fetchRoster = async () => {
    try {
      const usersList = await api.getUsers();
      if (usersList && usersList.length > 0) {
        setRegisteredRangers(usersList.filter((u) => u.role !== 'guest'));
      }
    } catch (e) {
      // fallback
    }
  };

  useEffect(() => {
    fetchRoster();
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(null);
    setSaveError(null);

    try {
      const res = await updateProfile({
        id: user?.id,
        name: editName.trim(),
        mobileNumber: editMobile.trim(),
        email: editEmail.trim(),
        division: editDivision.trim(),
        beat: editBeat.trim(),
        emergencyContact: editEmergency.trim(),
      });

      if (res.success) {
        setSaveSuccess('Profile updated successfully!');
        setIsEditing(false);
        fetchRoster();
        setTimeout(() => setSaveSuccess(null), 3500);
      } else {
        setSaveError(res.error || 'Failed to update profile');
      }
    } catch (err: any) {
      setSaveError(err.message || 'Error saving profile');
    } finally {
      setSaving(false);
    }
  };

  const forestDivisions = [
    'Tadoba-Andhari Tiger Reserve',
    'Sahyadri Tiger Reserve',
    'Melghat Tiger Reserve',
    'Pench Tiger Reserve (Maharashtra)',
    'Nagzira-Navegaon Wildlife Sanctuary',
    'Chandrapur Forest Circle',
    'Western Ghats Conservation Division',
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 0. Top Navigation & Dashboard Preview Bar (Backward option and Cross option to cut preview) */}
      <div className="flex items-center justify-between p-3.5 px-4 sm:px-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all cursor-pointer group shadow-2xs"
            title="Back to Main Dashboard (←)"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Dashboard</span>
          </button>

          <button
            onClick={() => navigate('/')}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-colors cursor-pointer"
            title="Close Profile Preview (✕)"
            aria-label="Close Preview"
          >
            <X className="w-5 h-5" />
          </button>

          <span className="text-slate-300 hidden sm:inline">|</span>
          <span className="text-xs font-semibold text-slate-500 hidden md:inline">
            Officer Profile & ID Card Dashboard Preview
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <button
              onClick={async () => {
                await logout();
                navigate('/');
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
              title="Sign Out of VanRakshak"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-600" />
              <span>Sign Out</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setAuthModalTab('login');
                setIsAuthModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              <UserCheck className="w-3.5 h-3.5 text-tealbrand-300" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>

      {/* Signed-Out Warning Banner */}
      {!isAuthenticated && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-950 shadow-xs animate-in fade-in">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-amber-900">You are currently signed out</p>
              <p className="text-[11px] text-amber-800">
                Sign in with your registered mobile number/email or register a new officer profile.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => {
                setAuthModalTab('login');
                setIsAuthModalOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs shadow-xs cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setAuthModalTab('register');
                setIsAuthModalOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-xl border border-amber-300 bg-white hover:bg-amber-100/60 text-amber-900 font-bold text-xs cursor-pointer"
            >
              Register New Ranger
            </button>
          </div>
        </div>
      )}

      {/* 1. Header Hero Banner */}
      <div className="bg-gradient-to-r from-forest-900 via-forest-800 to-tealbrand-800 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg border border-forest-700">
        <div className="absolute top-0 right-0 w-80 h-80 bg-tealbrand-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-forest-700/80 border-2 border-tealbrand-400/40 flex items-center justify-center text-tealbrand-300 shadow-xl flex-shrink-0">
              <Shield className="w-9 h-9 text-tealbrand-300" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {user?.name || (isAuthenticated ? 'Forest Officer' : 'Guest Officer')}
                </h1>
                <span className="px-2.5 py-1 rounded-full bg-tealbrand-400/20 text-tealbrand-200 text-xs font-bold border border-tealbrand-400/30">
                  {user?.badgeNumber || 'MH-FR-2024-089'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center gap-1 border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>
                    {dutyStatus === 'on_duty' ? 'Active Duty' : dutyStatus === 'standby' ? 'Standby' : 'Off Duty'}
                  </span>
                </span>
              </div>

              <p className="text-sm text-forest-100 font-medium mt-1">
                {user?.division || 'Tadoba-Andhari Tiger Reserve'} • Beat: {user?.beat || 'Moharli Core Beat'}
              </p>

              <div className="flex items-center gap-4 text-xs text-forest-200 mt-2 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-tealbrand-300" />
                  <span>{user?.mobileNumber || '+91 98201 44521'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-tealbrand-300" />
                  <span>{user?.email || 'officer@forest.gov.in'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-tealbrand-300" />
                  <span>Channel: 865.0625 MHz (LoRa IN865)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => {
                setAuthModalTab('register');
                setIsAuthModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-tealbrand-500 hover:bg-tealbrand-600 active:scale-95 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register New Ranger</span>
            </button>

            <button
              onClick={() => {
                setAuthModalTab('login');
                setIsAuthModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold text-xs flex items-center gap-2 border border-white/20 transition-all cursor-pointer"
            >
              <span>Switch Account</span>
            </button>

            {isAuthenticated && (
              <button
                onClick={async () => {
                  await logout();
                  navigate('/');
                }}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Notifications */}
      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-sm text-emerald-900 font-semibold shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {saveError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-sm text-red-900 font-semibold shadow-xs animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      {/* 2. Main Grid: Digital ID Card + Operational Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Digital Ranger Identity Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md relative overflow-hidden">
            {/* Top Card Badge Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-forest-800 text-tealbrand-300 flex items-center justify-center font-bold">
                  VR
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-forest-900">
                    Forest Department
                  </h3>
                  <p className="text-[10px] text-slate-500 font-medium">VanRakshak Field Credential</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-forest-50 text-forest-800 text-[10px] font-bold border border-forest-200 uppercase">
                Official ID
              </span>
            </div>

            {/* Profile Photo / Avatar & Hologram */}
            <div className="pt-6 pb-4 flex flex-col items-center text-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-forest-800 to-tealbrand-700 text-white flex items-center justify-center text-3xl font-black shadow-lg border-4 border-white">
                  {user?.name ? user.name.charAt(0) : 'R'}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white" title="Active Credential">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>

              <h2 className="text-lg font-black text-slate-900 mt-3">{user?.name || 'Forest Officer'}</h2>
              <p className="text-xs font-bold text-forest-800 uppercase tracking-wide">
                {role === 'admin' ? 'Forest Division Officer' : 'Active Forest Ranger'}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">{user?.badgeNumber || 'MH-FR-2024-089'}</p>
            </div>

            {/* Credential Data Fields */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Mobile Number:</span>
                <span className="font-bold text-slate-900 font-mono">{user?.mobileNumber || '+91 98201 44521'}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Division:</span>
                <span className="font-bold text-slate-900 truncate max-w-[180px] text-right">{user?.division || 'Tadoba-Andhari'}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Assigned Beat:</span>
                <span className="font-bold text-slate-900">{user?.beat || 'Moharli Core'}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Emergency Call:</span>
                <span className="font-bold text-slate-900 truncate max-w-[180px] text-right">{user?.emergencyContact || '+91 98201 44000'}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500 font-medium">Duty Status:</span>
                <select
                  value={dutyStatus}
                  onChange={(e) => setDutyStatus(e.target.value as any)}
                  className="px-2 py-0.5 rounded border border-slate-200 text-xs font-bold text-forest-900 bg-forest-50/50"
                >
                  <option value="on_duty">On Duty (Active)</option>
                  <option value="standby">Standby (Base Camp)</option>
                  <option value="off_duty">Off Duty (Resting)</option>
                </select>
              </div>
            </div>

            {/* Barcode & Verification Seal */}
            <div className="mt-5 p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <QrCode className="w-8 h-8 text-forest-800" />
                <div className="text-[10px] text-slate-500 leading-tight">
                  <p className="font-mono font-bold text-slate-700">WPC-IN865-CERT</p>
                  <p>SHA-256 Ranger Verified</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => window.print()}
                className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 text-xs flex items-center gap-1 cursor-pointer"
                title="Print Ranger Credential"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-[11px] font-semibold">Print</span>
              </button>
            </div>
          </div>

          {/* Operational Quick Metrics */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Ranger Operational Telemetry
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-forest-50/70 border border-forest-100">
                <span className="text-[10px] font-bold text-forest-800 uppercase tracking-wider block">Alerts Verified</span>
                <span className="text-2xl font-black text-forest-900 mt-1 block">18</span>
                <span className="text-[10px] text-forest-600 font-medium">100% Audit Logged</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-tealbrand-50/70 border border-tealbrand-100">
                <span className="text-[10px] font-bold text-tealbrand-800 uppercase tracking-wider block">Patrols Logged</span>
                <span className="text-2xl font-black text-tealbrand-900 mt-1 block">12</span>
                <span className="text-[10px] text-tealbrand-700 font-medium">Average 8.4 km</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-100">
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">Nodes Linked</span>
                <span className="text-2xl font-black text-amber-900 mt-1 block">6</span>
                <span className="text-[10px] text-amber-700 font-medium">Zone A & Zone B</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Avg Response</span>
                <span className="text-2xl font-black text-slate-900 mt-1 block">1.8m</span>
                <span className="text-[10px] text-slate-500 font-medium">Fast Dispatch</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Editable Profile Form & Registered Team Personnel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Edit Profile Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-md space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  {language === 'hi' ? 'रेंजर प्रोफाइल विवरण' : language === 'mr' ? 'रेंजर प्रोफाइल तपशील' : 'Ranger Profile Details'}
                </h2>
                <p className="text-xs text-slate-500">
                  {language === 'hi'
                    ? 'यहाँ दिए गए विवरण आपके रेंजर कार्ड और अलर्ट संचार में उपयोग होते हैं।'
                    : language === 'mr'
                    ? 'येथील माहिती आपल्या रेंजर कार्ड आणि अलर्टसाठी वापरली जाते.'
                    : 'Personal details used for dispatch communications.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:border-forest-600 bg-white hover:bg-forest-50 text-forest-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditing ? 'Cancel Edit' : 'Edit Details'}</span>
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    {language === 'hi' ? 'पूरा नाम' : language === 'mr' ? 'पूर्ण नाव' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 disabled:bg-slate-50 disabled:text-slate-600 focus:border-forest-600 focus:ring-2 focus:ring-forest-600/20 outline-none"
                  />
                </div>

                {/* Mobile Number */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    {language === 'hi' ? 'मोबाइल नंबर (SMS/कॉल अलर्ट)' : language === 'mr' ? 'मोबाईल नंबर' : 'Mobile Number (Alert Dispatch)'}
                  </label>
                  <input
                    type="tel"
                    disabled={!isEditing}
                    value={editMobile}
                    onChange={(e) => setEditMobile(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 disabled:bg-slate-50 disabled:text-slate-600 focus:border-forest-600 focus:ring-2 focus:ring-forest-600/20 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email Address */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    {language === 'hi' ? 'आधिकारिक ईमेल' : language === 'mr' ? 'ईमेल पत्ता' : 'Official Email Address'}
                  </label>
                  <input
                    type="email"
                    disabled={!isEditing}
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 disabled:bg-slate-50 disabled:text-slate-600 focus:border-forest-600 focus:ring-2 focus:ring-forest-600/20 outline-none"
                  />
                </div>

                {/* Emergency Contact */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    {language === 'hi' ? 'आपातकालीन नियंत्रण कक्ष नंबर' : language === 'mr' ? 'आपत्कालीन संपर्क' : 'Emergency Dispatch Contact'}
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={editEmergency}
                    onChange={(e) => setEditEmergency(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 disabled:bg-slate-50 disabled:text-slate-600 focus:border-forest-600 focus:ring-2 focus:ring-forest-600/20 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Forest Division */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    {language === 'hi' ? 'वन प्रभाग / टाइगर रिजर्व' : language === 'mr' ? 'वन प्रभाग' : 'Forest Division / Sanctuary'}
                  </label>
                  <select
                    disabled={!isEditing}
                    value={editDivision}
                    onChange={(e) => setEditDivision(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 disabled:bg-slate-50 disabled:text-slate-600 focus:border-forest-600 focus:ring-2 focus:ring-forest-600/20 outline-none bg-white"
                  >
                    {forestDivisions.map((div) => (
                      <option key={div} value={div}>
                        {div}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Beat / Range */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    {language === 'hi' ? 'बीट / गश्ती रेंज' : language === 'mr' ? 'बीट / कार्यक्षेत्र' : 'Patrol Beat / Sector'}
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={editBeat}
                    onChange={(e) => setEditBeat(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 disabled:bg-slate-50 disabled:text-slate-600 focus:border-forest-600 focus:ring-2 focus:ring-forest-600/20 outline-none"
                  />
                </div>
              </div>

              {isEditing && (
                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 rounded-xl bg-forest-800 hover:bg-forest-900 active:scale-95 text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all"
                  >
                    <Save className="w-3.5 h-3.5 text-tealbrand-300" />
                    <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Section 2: Registered Personnel Database Roster */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-tealbrand-50 border border-tealbrand-200 text-tealbrand-800 flex items-center justify-center">
                  <Users className="w-4 h-4 text-tealbrand-700" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    {language === 'hi' ? 'पंजीकृत वन अधिकारी एवं रेंजर' : language === 'mr' ? 'नोंदणीकृत वन अधिकारी व रेंजर यादी' : 'Registered Forest Officers & Rangers Roster'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Division team roster ({registeredRangers.length} personnel)
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setAuthModalTab('register');
                  setIsAuthModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-forest-50 hover:bg-forest-100 text-forest-800 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5 text-forest-700" />
                <span>Add Officer</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-2.5 px-3">Ranger / Officer</th>
                    <th className="py-2.5 px-3">Role</th>
                    <th className="py-2.5 px-3">Mobile Number</th>
                    <th className="py-2.5 px-3">Division & Beat</th>
                    <th className="py-2.5 px-3 text-right">Badge ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {registeredRangers.map((r) => {
                    const isSelf = r.id === user?.id;
                    return (
                      <tr
                        key={r.id}
                        className={`hover:bg-slate-50/80 transition-colors ${
                          isSelf ? 'bg-forest-50/50 font-semibold' : ''
                        }`}
                      >
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-forest-100 text-forest-800 font-bold flex items-center justify-center text-xs flex-shrink-0">
                              {r.name ? r.name.charAt(0) : 'R'}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 leading-tight">
                                {r.name} {isSelf && <span className="text-[10px] text-forest-700">(You)</span>}
                              </p>
                              <p className="text-[10px] text-slate-400">{r.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              r.role === 'admin'
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : r.role === 'ranger'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {r.role}
                          </span>
                        </td>

                        <td className="py-3 px-3 font-mono text-slate-700">
                          {r.mobileNumber || '+91 98201 44521'}
                        </td>

                        <td className="py-3 px-3 text-slate-600">
                          <p className="font-medium text-slate-800 truncate max-w-[160px]">{r.division || 'Tadoba-Andhari'}</p>
                          <p className="text-[10px] text-slate-400">{r.beat || 'Core Beat'}</p>
                        </td>

                        <td className="py-3 px-3 text-right font-mono font-bold text-slate-700">
                          {r.badgeNumber || 'MH-FR-2024'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Global Auth Modal for Registration or Login */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultTab={authModalTab}
        onSuccess={() => {
          fetchRoster();
        }}
      />
    </div>
  );
};
