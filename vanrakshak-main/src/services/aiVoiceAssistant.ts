/**
 * VanRakshak AI Voice Assistant Service
 * Provides native Web Audio chimes and Web Speech API text-to-speech
 * in English, Hindi (हिंदी), and Marathi (मराठी).
 */

export type SupportedLanguage = 'en' | 'hi' | 'mr';

export interface VoiceWelcomeContent {
  spokenText: string;
  uiPrompt: string;
  langTag: string;
}

export const WELCOME_VOICE_SCRIPTS: Record<SupportedLanguage, VoiceWelcomeContent> = {
  en: {
    spokenText: 'Welcome to VanRakshak.',
    uiPrompt: 'Welcome to VanRakshak',
    langTag: 'en-IN',
  },
  hi: {
    spokenText: 'वनरक्षक में आपका स्वागत है।',
    uiPrompt: 'वनरक्षक में आपका स्वागत है',
    langTag: 'hi-IN',
  },
  mr: {
    spokenText: 'वनरक्षक मध्ये आपले स्वागत आहे.',
    uiPrompt: 'वनरक्षक मध्ये आपले स्वागत आहे',
    langTag: 'mr-IN',
  },
};

// Module-level references to track active audio context and speech tokens
let activeAudioContext: AudioContext | null = null;
let activeSpeechToken = 0;

/**
 * Play a pleasant acoustic notification chime using Web Audio API
 */
export function playChime(): Promise<void> {
  return new Promise((resolve) => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) {
        resolve();
        return;
      }
      const ctx = new AudioContextClass();
      activeAudioContext = ctx;

      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';

      // 520 Hz (C5) rising to 659 Hz (E5) and 784 Hz (G5) harmonic chord
      osc1.frequency.setValueAtTime(523.25, now);
      osc1.frequency.exponentialRampToValueAtTime(783.99, now + 0.25);

      osc2.frequency.setValueAtTime(659.25, now);
      osc2.frequency.exponentialRampToValueAtTime(1046.5, now + 0.25);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.5);
      osc2.stop(now + 0.5);

      setTimeout(() => {
        if (activeAudioContext === ctx) {
          activeAudioContext = null;
        }
        resolve();
      }, 300);
    } catch (e) {
      activeAudioContext = null;
      resolve();
    }
  });
}

/**
 * Immediately stop and cancel any ongoing speech or chime.
 * Used when a user clicks "Start" midway through speech or switches languages.
 */
export function stopVoice(): void {
  // Invalidate any in-flight async speech promises
  activeSpeechToken++;

  // 1. Cancel Web Speech API immediately
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {
      // Ignore errors in environments where synthesis cancel is restricted
    }
  }

  // 2. Terminate any active Web Audio chime immediately
  if (activeAudioContext) {
    try {
      if (activeAudioContext.state !== 'closed') {
        activeAudioContext.close();
      }
    } catch (e) {
      // Ignore audio context close errors
    }
    activeAudioContext = null;
  }
}

/**
 * Check if the voice assistant is currently active or speaking
 */
export function isVoiceActive(): boolean {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    return window.speechSynthesis.speaking || window.speechSynthesis.pending || activeAudioContext !== null;
  }
  return activeAudioContext !== null;
}

/**
 * Speak the welcome message using Web Speech API in the selected language.
 * Checks the active token after the chime so speech will NOT begin
 * if the user clicked "Start" or cancelled during the chime!
 */
export async function speakWelcomeMessage(
  lang: SupportedLanguage,
  onStart?: () => void,
  onEnd?: () => void
): Promise<void> {
  // Stop any active utterance first
  stopVoice();

  // Create a fresh token for this playback session
  const token = ++activeSpeechToken;

  // First play the futuristic VanRakshak chime
  await playChime();

  // If stopVoice was called while the chime was playing (e.g. user clicked Start), abort immediately!
  if (token !== activeSpeechToken) {
    onEnd?.();
    return;
  }

  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onStart) onStart();
    if (onEnd) {
      setTimeout(() => {
        if (token === activeSpeechToken) {
          onEnd();
        }
      }, 2000);
    }
    return;
  }

  const synth = window.speechSynthesis;
  synth.cancel(); // Stop any pending speech

  if (token !== activeSpeechToken) {
    onEnd?.();
    return;
  }

  const script = WELCOME_VOICE_SCRIPTS[lang];
  const utterance = new SpeechSynthesisUtterance(script.spokenText);

  // Attempt to select the best matching voice
  const voices = synth.getVoices();
  let targetVoice: SpeechSynthesisVoice | null = null;

  if (lang === 'en') {
    targetVoice =
      voices.find((v) => v.lang.toLowerCase() === 'en-in') ||
      voices.find((v) => v.lang.toLowerCase().startsWith('en')) ||
      null;
    utterance.lang = 'en-IN';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
  } else if (lang === 'hi') {
    targetVoice =
      voices.find((v) => v.lang.toLowerCase() === 'hi-in' || v.lang.toLowerCase().startsWith('hi')) ||
      null;
    utterance.lang = 'hi-IN';
    utterance.rate = 0.9;
    utterance.pitch = 1.05;
  } else if (lang === 'mr') {
    // Look for Marathi voice first, fallback to Hindi voice (both use Devanagari script phonetics)
    targetVoice =
      voices.find((v) => v.lang.toLowerCase() === 'mr-in' || v.lang.toLowerCase().startsWith('mr')) ||
      voices.find((v) => v.lang.toLowerCase() === 'hi-in' || v.lang.toLowerCase().startsWith('hi')) ||
      null;
    utterance.lang = targetVoice && targetVoice.lang.startsWith('mr') ? 'mr-IN' : 'hi-IN';
    utterance.rate = 0.9;
    utterance.pitch = 1.05;
  }

  if (targetVoice) {
    utterance.voice = targetVoice;
  }

  utterance.onstart = () => {
    if (token === activeSpeechToken && onStart) {
      onStart();
    }
  };

  utterance.onend = () => {
    if (token === activeSpeechToken && onEnd) {
      onEnd();
    }
  };

  utterance.onerror = () => {
    if (token === activeSpeechToken && onEnd) {
      onEnd();
    }
  };

  synth.speak(utterance);
}
