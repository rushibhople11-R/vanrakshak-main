import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Check,
  User,
  Lock,
  Phone,
  Mail,
  Building2,
  MapPin,
  Award,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  X,
  Eye,
  EyeOff,
  UserCheck,
  UserPlus,
} from 'lucide-react';
import { UserRole } from '../types';

export const LoginPage: React.FC = () => {
  const { switchRole, register, loginWithCredentials, role, user } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>(role || 'ranger');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Registration Form State
  const [regName, setRegName] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regDivision, setRegDivision] = useState('Tadoba-Andhari Tiger Reserve');
  const [regBeat, setRegBeat] = useState('Moharli Core Beat');
  const [regRole, setRegRole] = useState<UserRole>('ranger');
  const [regEmergency, setRegEmergency] = useState('');

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const forestDivisions = [
    'Tadoba-Andhari Tiger Reserve',
    'Sahyadri Tiger Reserve',
    'Melghat Tiger Reserve',
    'Pench Tiger Reserve (Maharashtra)',
    'Nagzira-Navegaon Wildlife Sanctuary',
    'Chandrapur Forest Circle',
    'Western Ghats Conservation Division',
  ];

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!loginIdentifier.trim()) {
      setErrorMessage(
        language === 'hi'
          ? 'कृपया मोबाइल नंबर या ईमेल दर्ज करें'
          : language === 'mr'
          ? 'कृपया मोबाईल नंबर किंवा ईमेल टाका'
          : 'Please enter your registered mobile number or email.'
      );
      return;
    }

    setLoading(true);
    try {
      const res = await loginWithCredentials(loginIdentifier.trim(), loginPassword);
      if (res.success) {
        setSuccessMessage('Logged in successfully! Redirecting to Profile...');
        setTimeout(() => {
          navigate('/profile');
        }, 800);
      } else {
        setErrorMessage(res.error || 'Invalid mobile number/email or password');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!regName.trim() || regName.trim().length < 2) {
      setErrorMessage(
        language === 'hi'
          ? 'कृपया पूरा नाम दर्ज करें'
          : language === 'mr'
          ? 'कृपया पूर्ण नाव प्रविष्ट करा'
          : 'Please enter your full name.'
      );
      return;
    }

    const cleanPhone = regMobile.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage(
        language === 'hi'
          ? 'कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें'
          : language === 'mr'
          ? 'कृपया १० अंकांचा वैध मोबाईल क्रमांक टाका'
          : 'Please enter a valid 10-digit mobile number.'
      );
      return;
    }

    if (!regEmail.includes('@')) {
      setErrorMessage(
        language === 'hi'
          ? 'कृपया वैध ईमेल पता दर्ज करें'
          : language === 'mr'
          ? 'कृपया वैध ईमेल पत्ता प्रविष्ट करा'
          : 'Please enter a valid email address.'
      );
      return;
    }

    if (regPassword.length < 4) {
      setErrorMessage(
        language === 'hi'
          ? 'पासवर्ड कम से कम 4 अक्षरों का होना चाहिए'
          : language === 'mr'
          ? 'पासवर्ड किमान ४ अक्षरांचा असावा'
          : 'Password must be at least 4 characters.'
      );
      return;
    }

    setLoading(true);
    try {
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
          navigate('/profile');
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

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-6 px-4">
      <div className="max-w-xl w-full bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden space-y-0">
        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-forest-900 via-forest-800 to-tealbrand-800 p-6 text-white text-center relative">
          {/* Backward Option and Cross Option to Cut Preview */}
          <button
            type="button"
            onClick={() => navigate('/')}
            className="absolute top-5 left-5 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer group"
            title="Back to Dashboard (←)"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-tealbrand-300 group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline">Back</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Close / Cut Preview (✕)"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 rounded-2xl bg-forest-700/80 border border-forest-600/60 flex items-center justify-center mx-auto mb-3 shadow-md">
            <Shield className="w-8 h-8 text-tealbrand-300" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">VanRakshak Access Portal</h1>
          <p className="text-xs text-forest-200 mt-1">
            Forest Officer Authentication & Registration
          </p>

          {/* Tab Selector */}
          <div className="flex bg-forest-950/40 p-1 rounded-xl mt-5 border border-forest-600/30 max-w-sm mx-auto">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-extrabold transition-all ${
                activeTab === 'login'
                  ? 'bg-white text-slate-900 shadow-md font-extrabold'
                  : 'text-emerald-100 hover:text-white'
              }`}
            >
              {language === 'hi' ? 'रेंजर लॉगिन' : language === 'mr' ? 'रेंजर लॉगिन' : 'Officer Login'}
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-extrabold transition-all ${
                activeTab === 'register'
                  ? 'bg-white text-slate-900 shadow-md font-extrabold'
                  : 'text-emerald-100 hover:text-white'
              }`}
            >
              {language === 'hi' ? 'रेंजर पंजीकरण' : language === 'mr' ? 'रेंजर नोंदणी' : 'Officer Registration'}
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-6">
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

          {/* TAB 1: LOGIN */}
          {activeTab === 'login' && (
            <div className="space-y-6">
              {/* Credentials Login Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-forest-700" />
                    <span>
                      {language === 'hi'
                        ? 'पंजीकृत मोबाइल नंबर या ईमेल'
                        : language === 'mr'
                        ? 'नोंदणीकृत मोबाईल नंबर किंवा ईमेल'
                        : 'Registered Mobile Number or Email'}
                    </span>
                  </label>
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="+91 98201 44521 or officer@forest.gov.in"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-forest-600 focus:ring-2 focus:ring-forest-600/20 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-forest-700" />
                    <span>{language === 'hi' ? 'पासवर्ड' : language === 'mr' ? 'पासवर्ड' : 'Password'}</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter password (default: ranger123)"
                      className="w-full pl-3.5 pr-9 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-forest-600 focus:ring-2 focus:ring-forest-600/20 outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="flex-1 py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
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
                        ? (language === 'hi' ? 'सत्यापन हो रहा है...' : language === 'mr' ? 'तपासत आहे...' : 'Signing In...')
                        : (language === 'hi' ? 'कमांड सेंटर में लॉग इन करें' : language === 'mr' ? 'लॉग इन करा' : 'Sign In to Command Center')}
                    </span>
                    <ArrowRight className="w-4 h-4 text-tealbrand-300" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: REGISTRATION */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
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
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-forest-700" />
                    <span>
                      {language === 'hi'
                        ? 'मोबाइल नंबर (10 अंक)'
                        : language === 'mr'
                        ? 'मोबाईल नंबर'
                        : 'Mobile Number'} *
                    </span>
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
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
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
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
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
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
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
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-forest-700" />
                    <span>{language === 'hi' ? 'बीट / गश्ती रेंज' : language === 'mr' ? 'बीट / रेंज' : 'Beat / Range Assignment'}</span>
                  </label>
                  <input
                    type="text"
                    value={regBeat}
                    onChange={(e) => setRegBeat(e.target.value)}
                    placeholder="e.g. Moharli Core Beat"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-forest-600 outline-none"
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
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
                <label className="text-xs font-bold text-slate-700">
                  {language === 'hi'
                    ? 'आपातकालीन संपर्क / रेडियो चैनल'
                    : language === 'mr'
                    ? 'आपत्कालीन संपर्क'
                    : 'Emergency Radio Call / Dispatch Contact'}
                </label>
                <input
                  type="text"
                  value={regEmergency}
                  onChange={(e) => setRegEmergency(e.target.value)}
                  placeholder="e.g. +91 98201 44000 (Tadoba Control Room)"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-forest-600 outline-none"
                />
              </div>

              {/* Submit & Cancel Registration Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="flex-1 py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
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

          {/* Quick link to Profile if user already exists */}
          {user && (
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="text-xs font-bold text-forest-800 hover:text-forest-950 underline flex items-center justify-center gap-1.5 mx-auto"
              >
                <UserCheck className="w-4 h-4 text-forest-700" />
                <span>Go to Active Ranger Profile ({user.name})</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

