import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Shield,
  User,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Building2,
  MapPin,
  Award,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  X,
  Sparkles,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'register',
  onSuccess,
}) => {
  const { register, loginWithCredentials, switchRole, user } = useAuth();
  const { language } = useLanguage();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>(defaultTab);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Registration Form State
  const [regName, setRegName] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regDivision, setRegDivision] = useState('Tadoba-Andhari Tiger Reserve');
  const [regBeat, setRegBeat] = useState('Moharli Core Beat');
  const [regRole, setRegRole] = useState<'ranger' | 'admin' | 'guest'>('ranger');
  const [regEmergency, setRegEmergency] = useState('');

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const forestDivisions = [
    'Tadoba-Andhari Tiger Reserve',
    'Sahyadri Tiger Reserve',
    'Melghat Tiger Reserve',
    'Pench Tiger Reserve (Maharashtra)',
    'Nagzira-Navegaon Wildlife Sanctuary',
    'Chandrapur Forest Circle',
    'Western Ghats Conservation Division',
  ];

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!regName.trim() || regName.trim().length < 2) {
      setErrorMessage(language === 'hi' ? 'कृपया पूरा नाम दर्ज करें' : language === 'mr' ? 'कृपया पूर्ण नाव प्रविष्ट करा' : 'Please enter your full name.');
      return;
    }

    const cleanPhone = regMobile.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage(language === 'hi' ? 'कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें' : language === 'mr' ? 'कृपया १० अंकांचा वैध मोबाईल क्रमांक टाका' : 'Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!regEmail.includes('@')) {
      setErrorMessage(language === 'hi' ? 'कृपया वैध ईमेल पता दर्ज करें' : language === 'mr' ? 'कृपया वैध ईमेल पत्ता प्रविष्ट करा' : 'Please enter a valid email address.');
      return;
    }

    if (regPassword.length < 4) {
      setErrorMessage(language === 'hi' ? 'पासवर्ड कम से कम 4 अक्षरों का होना चाहिए' : language === 'mr' ? 'पासवर्ड किमान ४ अक्षरांचा असावा' : 'Password must be at least 4 characters.');
      return;
    }

    setLoading(true);
    try {
      // Format Indian phone number standard
      const formattedMobile = regMobile.startsWith('+91')
        ? regMobile.trim()
        : `+91 ${cleanPhone.slice(-10)}`;

      const res = await register({
        name: regName.trim(),
        mobileNumber: formattedMobile,
        email: regEmail.trim().toLowerCase(),
        password: regPassword,
        role: regRole,
        division: regDivision,
        beat: regBeat,
        emergencyContact: regEmergency.trim() || '+91 98201 44000 (HQ Dispatch)',
      });

      if (res.success) {
        setSuccessMessage('Registration successful! Welcome to VanRakshak.');
        setTimeout(() => {
          if (onSuccess) onSuccess();
          onClose();
        }, 1000);
      } else {
        setErrorMessage(res.error || 'Registration failed');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!loginIdentifier.trim()) {
      setErrorMessage(language === 'hi' ? 'कृपया मोबाइल नंबर या ईमेल दर्ज करें' : language === 'mr' ? 'कृपया मोबाईल नंबर किंवा ईमेल टाका' : 'Please enter your registered mobile number or email.');
      return;
    }

    setLoading(true);
    try {
      const res = await loginWithCredentials(loginIdentifier.trim(), loginPassword);
      if (res.success) {
        setSuccessMessage('Welcome back! Logged in successfully.');
        setTimeout(() => {
          if (onSuccess) onSuccess();
          onClose();
        }, 900);
      } else {
        setErrorMessage(res.error || 'Invalid mobile number/email or password');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoSwitch = async (role: 'ranger' | 'admin' | 'guest') => {
    setLoading(true);
    try {
      await switchRole(role);
      setSuccessMessage(`Switched to demo persona: ${role.toUpperCase()}`);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 700);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-8 z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header with Forest Shield */}
        <div className="bg-gradient-to-r from-forest-900 via-forest-800 to-tealbrand-800 p-5 sm:p-6 text-white relative">
          {/* Top Bar with both Backward option and Cross option to cut preview */}
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-forest-700/60">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer group"
              title="Go Back / Cut Preview (Esc)"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-tealbrand-300 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Dashboard</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Close / Cut Preview (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-forest-700/80 border border-forest-600 flex items-center justify-center text-tealbrand-300 shadow-md">
              <Shield className="w-7 h-7 text-tealbrand-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">VanRakshak</h2>
                <span className="px-2 py-0.5 rounded-full bg-tealbrand-400/20 text-tealbrand-200 text-[10px] font-bold border border-tealbrand-400/30">
                  Officer Portal
                </span>
              </div>
              <p className="text-xs text-forest-200">Acoustic Forest Protection Network</p>
            </div>
          </div>

          {/* Tab Selector */}
          <div className="flex bg-forest-950/40 p-1 rounded-xl mt-5 border border-forest-600/40">
            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-extrabold transition-all ${
                activeTab === 'register'
                  ? 'bg-white text-slate-900 shadow-md font-extrabold'
                  : 'text-emerald-100 hover:text-white'
              }`}
            >
              {language === 'hi' ? 'रेंजर पंजीकरण' : language === 'mr' ? 'रेंजर नोंदणी' : 'Officer Registration'}
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-extrabold transition-all ${
                activeTab === 'login'
                  ? 'bg-white text-slate-900 shadow-md font-extrabold'
                  : 'text-emerald-100 hover:text-white'
              }`}
            >
              {language === 'hi' ? 'रेंजर लॉगिन' : language === 'mr' ? 'रेंजर लॉगिन' : 'Officer Login'}
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Notifications */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-800">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-xs text-emerald-800 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* 1. REGISTRATION FORM */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-forest-700" />
                    <span>{language === 'hi' ? 'पूरा नाम' : language === 'mr' ? 'पूर्ण नाव' : 'Full Name'} *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Officer Name"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-forest-600 focus:ring-2 focus:ring-forest-600/20 outline-none"
                  />
                </div>

                {/* Mobile Number */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-forest-700" />
                    <span>{language === 'hi' ? 'मोबाइल नंबर (10 अंक)' : language === 'mr' ? 'मोबाईल नंबर' : 'Mobile Number'} *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={regMobile}
                    onChange={(e) => setRegMobile(e.target.value)}
                    placeholder="+91 98201 44521"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-forest-600 focus:ring-2 focus:ring-forest-600/20 outline-none"
                  />
                </div>
              </div>

              {/* Email & Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-forest-700" />
                    <span>{language === 'hi' ? 'आधिकारिक ईमेल' : language === 'mr' ? 'ईमेल पत्ता' : 'Official Email'} *</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="officer@forest.gov.in"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-forest-600 focus:ring-2 focus:ring-forest-600/20 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-forest-700" />
                    <span>{language === 'hi' ? 'पासवर्ड' : language === 'mr' ? 'पासवर्ड' : 'Password'} *</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-3 pr-8 py-2 text-xs rounded-xl border border-slate-200 focus:border-forest-600 focus:ring-2 focus:ring-forest-600/20 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Forest Division & Beat */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-forest-700" />
                    <span>{language === 'hi' ? 'वन प्रभाग / टाइगर रिजर्व' : language === 'mr' ? 'वन विभाग' : 'Forest Division'}</span>
                  </label>
                  <select
                    value={regDivision}
                    onChange={(e) => setRegDivision(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:border-forest-600 focus:ring-2 focus:ring-forest-600/20 outline-none"
                  >
                    {forestDivisions.map((div) => (
                      <option key={div} value={div}>
                        {div}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-forest-700" />
                    <span>{language === 'hi' ? 'बीट / गश्ती रेंज' : language === 'mr' ? 'बीट / रेंज' : 'Beat / Range Assignment'}</span>
                  </label>
                  <input
                    type="text"
                    value={regBeat}
                    onChange={(e) => setRegBeat(e.target.value)}
                    placeholder="e.g. Moharli Core Beat"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-forest-600 focus:ring-2 focus:ring-forest-600/20 outline-none"
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-forest-700" />
                  <span>{language === 'hi' ? 'रेंजर पदनाम / भूमिका' : language === 'mr' ? 'भूमिका' : 'Forest Role'}</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'ranger', title: 'Forest Ranger', subtitle: 'Field Operations' },
                    { id: 'admin', title: 'Division Admin', subtitle: 'Command & Admin' },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRegRole(r.id as any)}
                      className={`p-2 rounded-xl border text-left transition-all ${
                        regRole === r.id
                          ? 'border-forest-800 bg-forest-50/80 font-bold text-forest-900 shadow-2xs'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <p className="text-[11px] font-bold leading-tight">{r.title}</p>
                      <p className="text-[10px] text-slate-500">{r.subtitle}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">
                  {language === 'hi' ? 'आपातकालीन संपर्क / रेडियो चैनल' : language === 'mr' ? 'आपत्कालीन संपर्क' : 'Emergency Radio Call / Dispatch Contact'}
                </label>
                <input
                  type="text"
                  value={regEmergency}
                  onChange={(e) => setRegEmergency(e.target.value)}
                  placeholder="e.g. +91 98201 44000 (Tadoba Control Room)"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-forest-600 outline-none"
                />
              </div>

              {/* Submit & Cancel Buttons */}
              <div className="flex items-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 px-3 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
                  <span>Cancel</span>
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-[2] py-3 px-4 rounded-xl bg-forest-800 hover:bg-forest-900 active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-forest-900/20 transition-all cursor-pointer"
                >
                  <span>
                    {loading
                      ? (language === 'hi' ? 'पंजीकरण हो रहा है...' : language === 'mr' ? 'नोंदणी होत आहे...' : 'Registering...')
                      : (language === 'hi' ? 'रजिस्टर करें' : language === 'mr' ? 'नोंदणी करा' : 'Register')}
                  </span>
                  <ArrowRight className="w-4 h-4 text-tealbrand-300" />
                </button>
              </div>
            </form>
          )}

          {/* 2. LOGIN FORM */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-forest-700" />
                  <span>{language === 'hi' ? 'पंजीकृत मोबाइल नंबर या ईमेल' : language === 'mr' ? 'नोंदणीकृत मोबाईल नंबर किंवा ईमेल' : 'Registered Mobile Number or Email'} *</span>
                </label>
                <input
                  type="text"
                  required
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="+91 98201 44521 or officer@forest.gov.in"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-forest-600 focus:ring-2 focus:ring-forest-600/20 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-forest-700" />
                  <span>{language === 'hi' ? 'पासवर्ड' : language === 'mr' ? 'पासवर्ड' : 'Password'}</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter password (default: ranger123)"
                    className="w-full pl-3 pr-8 py-2 text-xs rounded-xl border border-slate-200 focus:border-forest-600 focus:ring-2 focus:ring-forest-600/20 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 px-3 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
                  <span>Cancel</span>
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-[2] py-3 px-4 rounded-xl bg-forest-800 hover:bg-forest-900 active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-forest-900/20 transition-all cursor-pointer"
                >
                  <span>{loading ? (language === 'hi' ? 'सत्यापन हो रहा है...' : language === 'mr' ? 'तपासत आहे...' : 'Signing In...') : (language === 'hi' ? 'लॉग इन करें' : language === 'mr' ? 'लॉग इन करा' : 'Sign In')}</span>
                  <ArrowRight className="w-4 h-4 text-tealbrand-300" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
