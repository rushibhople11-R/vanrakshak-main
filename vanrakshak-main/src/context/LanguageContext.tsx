import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedLanguage, speakWelcomeMessage, stopVoice } from '../services/aiVoiceAssistant';
import { TRANSLATIONS, Translations } from '../services/translations';

interface LanguageContextType {
  language: SupportedLanguage;
  t: Translations;
  setLanguage: (lang: SupportedLanguage, speak?: boolean) => void;
  isWelcomeOpen: boolean;
  setIsWelcomeOpen: (open: boolean) => void;
  isSpeaking: boolean;
  playVoiceGreeting: (lang?: SupportedLanguage) => void;
  stopVoiceGreeting: () => void;
  startWithLanguage: (lang: SupportedLanguage) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  t: TRANSLATIONS.en,
  setLanguage: () => {},
  isWelcomeOpen: true,
  setIsWelcomeOpen: () => {},
  isSpeaking: false,
  playVoiceGreeting: () => {},
  stopVoiceGreeting: () => {},
  startWithLanguage: () => {},
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem('vr_lang');
    return saved === 'hi' || saved === 'mr' || saved === 'en' ? saved : 'en';
  });

  const [isWelcomeOpen, setIsWelcomeOpen] = useState<boolean>(() => {
    // When the app starts up, show the language onboarding gateway
    const hasStarted = sessionStorage.getItem('vr_session_started');
    return !hasStarted;
  });

  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const t = TRANSLATIONS[language];

  /**
   * Stop any in-progress speech synthesis or Web Audio chime immediately
   */
  const stopVoiceGreeting = () => {
    stopVoice();
    setIsSpeaking(false);
  };

  const playVoiceGreeting = (targetLang?: SupportedLanguage) => {
    const langToSpeak = targetLang || language;
    setIsSpeaking(true);
    speakWelcomeMessage(
      langToSpeak,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  const setLanguage = (newLang: SupportedLanguage, speak: boolean = true) => {
    // Cut off ongoing voice before switching language
    stopVoice();
    setIsSpeaking(false);

    setLanguageState(newLang);
    localStorage.setItem('vr_lang', newLang);
    if (speak) {
      playVoiceGreeting(newLang);
    }
  };

  /**
   * Language Method: startWithLanguage
   * When user clicks "Start" midway through the AI voice greeting,
   * this automatically cuts off and stops all voice audio immediately!
   */
  const startWithLanguage = (chosenLang: SupportedLanguage) => {
    // Automatically stop voice on start
    stopVoice();
    setIsSpeaking(false);

    setLanguageState(chosenLang);
    localStorage.setItem('vr_lang', chosenLang);
    sessionStorage.setItem('vr_session_started', 'true');
    setIsWelcomeOpen(false);
  };

  // Ensure speech synthesis is cancelled on unmount or component reload
  useEffect(() => {
    return () => {
      stopVoice();
    };
  }, []);

  return (
    <LanguageContext.Provider
      value={{
        language,
        t,
        setLanguage,
        isWelcomeOpen,
        setIsWelcomeOpen,
        isSpeaking,
        playVoiceGreeting,
        stopVoiceGreeting,
        startWithLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

