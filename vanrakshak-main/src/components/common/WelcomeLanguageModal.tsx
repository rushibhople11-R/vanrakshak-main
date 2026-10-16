import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { SupportedLanguage, WELCOME_VOICE_SCRIPTS } from '../../services/aiVoiceAssistant';
import {
  Shield,
  Volume2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle2,
  Globe,
  Radio,
  Play,
  RotateCcw,
} from 'lucide-react';

interface WelcomeLanguageModalProps {
  onComplete?: () => void;
}

export const WelcomeLanguageModal: React.FC<WelcomeLanguageModalProps> = ({ onComplete }) => {
  const {
    language,
    t,
    setLanguage,
    isWelcomeOpen,
    setIsWelcomeOpen,
    startWithLanguage,
    isSpeaking,
    playVoiceGreeting,
    stopVoiceGreeting,
  } = useLanguage();

  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>(language);

  const handleClose = () => {
    stopVoiceGreeting();
    setIsWelcomeOpen(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    if (isWelcomeOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isWelcomeOpen]);

  if (!isWelcomeOpen) return null;

  const languages: {
    id: SupportedLanguage;
    name: string;
    nativeName: string;
    subtitle: string;
    voicePreview: string;
  }[] = [
    {
      id: 'en',
      name: 'English',
      nativeName: 'English',
      subtitle: 'Solar-Powered Acoustic Edge-AI for Forest Protection',
      voicePreview: 'Welcome to VanRakshak',
    },
    {
      id: 'hi',
      name: 'Hindi',
      nativeName: 'हिंदी',
      subtitle: 'वन सुरक्षा हेतु सौर-ऊर्जा संचालित ध्वनिक एज-एआई प्रणाली',
      voicePreview: 'वनरक्षक में आपका स्वागत है',
    },
    {
      id: 'mr',
      name: 'Marathi',
      nativeName: 'मराठी',
      subtitle: 'जंगल संरक्षणासाठी सौर-ऊर्जेवर चालणारी ध्वनिक एज-एआई यंत्रणा',
      voicePreview: 'वनरक्षक मध्ये आपले स्वागत आहे',
    },
  ];

  const handleSelect = (id: SupportedLanguage) => {
    setSelectedLang(id);
    setLanguage(id, true);
  };

  /**
   * When user clicks Start in the midway of voice speaking,
   * automatically stop voice immediately and open the dashboard!
   */
  const handleStart = () => {
    stopVoiceGreeting();
    startWithLanguage(selectedLang);
    if (onComplete) {
      onComplete();
    }
  };

  const currentScript = WELCOME_VOICE_SCRIPTS[selectedLang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        onClick={handleClose}
      />

      <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header Banner in Forest Green & Teal */}
        <div className="bg-gradient-to-r from-forest-900 via-forest-800 to-tealbrand-800 p-5 sm:p-7 text-white relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-tealbrand-500/20 blur-2xl pointer-events-none" />

          {/* Top Bar with both Backward option and Cross option to cut preview */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-forest-700/60 relative z-10">
            <button
              type="button"
              onClick={handleClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer group"
              title="Go Back / Cut Preview (Esc)"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-tealbrand-300 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Dashboard</span>
            </button>

            <button
              type="button"
              onClick={handleClose}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Close / Cut Preview (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative z-10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-forest-700/80 border border-forest-600 flex items-center justify-center text-tealbrand-300 shadow-md">
                  <Shield className="w-6 h-6 text-tealbrand-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-extrabold tracking-tight text-white">VanRakshak</h2>
                    <span className="px-2 py-0.5 rounded-full bg-tealbrand-400/20 text-tealbrand-200 text-[10px] font-bold border border-tealbrand-400/30">
                      वनरक्षक • Edge-AI
                    </span>
                  </div>
                  <p className="text-xs text-forest-200">Autonomous Acoustic Forest Protection</p>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-[11px] font-medium border border-white/15">
                <Globe className="w-3.5 h-3.5 text-tealbrand-300" />
                <span>3 Languages Supported</span>
              </div>
            </div>

            <div className="pt-1">
              <h1 className="text-base sm:text-lg font-bold text-white">
                {t.selectLanguage}
              </h1>
              <p className="text-xs text-forest-100 max-w-xl leading-relaxed mt-0.5">
                {t.selectLanguageDesc}
              </p>
            </div>
          </div>
        </div>

        {/* Language Selection Cards Grid */}
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {languages.map((item) => {
              const isSelected = selectedLang === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  type="button"
                  className={`text-left p-4 rounded-2xl border-2 transition-all relative space-y-2 group flex flex-col justify-between ${
                    isSelected
                      ? 'border-forest-700 bg-forest-50/80 shadow-md scale-[1.02]'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between w-full">
                    <div>
                      <p className="text-lg font-extrabold text-slate-900 mt-0.5">
                        {item.nativeName}
                      </p>
                      <p className="text-xs text-slate-500 font-medium">({item.name})</p>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-forest-800 text-white'
                          : 'border border-slate-300 group-hover:border-slate-400'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-tealbrand-300 fill-forest-800" />}
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-snug line-clamp-2">
                    {item.subtitle}
                  </p>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center gap-1.5 text-[11px] text-forest-800 font-semibold">
                    <Volume2 className="w-3.5 h-3.5 text-forest-700" />
                    <span>{isSelected ? 'Voice Active' : 'Click to Hear'}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* AI Voice Assistant Spoken Audio Feedback Card */}
          <div className="p-4 bg-slate-900 rounded-2xl text-white space-y-2 border border-slate-800 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    isSpeaking ? 'bg-amber-500 text-slate-950 animate-bounce' : 'bg-forest-700 text-tealbrand-300'
                  }`}
                >
                  <Volume2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-tealbrand-400">
                    AI Voice Assistant
                  </span>
                  <p className="text-xs font-semibold text-slate-200">
                    {isSpeaking ? t.aiVoiceSpeaking : t.aiVoiceAssistant}
                  </p>
                </div>
              </div>

              {/* Sound waves animation while speaking */}
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span
                    key={i}
                    className={`w-1 rounded-full transition-all duration-200 ${
                      isSpeaking
                        ? 'bg-amber-400 animate-pulse'
                        : 'bg-slate-700 h-2'
                    }`}
                    style={{
                      height: isSpeaking ? `${8 + (i % 3) * 10}px` : '6px',
                      animationDelay: `${i * 120}ms`,
                    }}
                  />
                ))}
                <button
                  type="button"
                  onClick={() => playVoiceGreeting(selectedLang)}
                  className="ml-2 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 hover:text-white text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  title="Replay Audio Greeting"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span className="hidden sm:inline">{t.voiceReplay}</span>
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-300 font-medium bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/80 leading-relaxed font-sans">
              "{currentScript.spokenText}"
            </p>
          </div>

          {/* Action Button: Start Dashboard in Chosen Language */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-slate-500 hidden sm:block">
              <span>Selected Language: </span>
              <strong className="text-slate-900 font-bold capitalize">
                {languages.find((l) => l.id === selectedLang)?.nativeName} ({selectedLang.toUpperCase()})
              </strong>
            </div>

            <button
              onClick={handleStart}
              type="button"
              className="w-full sm:w-auto px-7 py-3 bg-forest-800 hover:bg-forest-900 active:scale-95 transition-all text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-forest-900/20 flex items-center justify-center gap-2 cursor-pointer"
              title="Start Dashboard (stops any speaking audio immediately)"
            >
              <span>{t.startDashboard}</span>
              <ArrowRight className="w-4 h-4 text-tealbrand-300" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
