import React, { useState, useRef, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Square,
  Sparkles,
  Activity,
  Layers,
  Radio,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Zap,
} from 'lucide-react';

interface SoundSample {
  id: string;
  name: string;
  category: 'chainsaw' | 'gunshot' | 'vehicle' | 'rain' | 'cicada';
  isThreat: boolean;
  expectedConfidence: number;
  dominantFreqRange: string;
  crestFactor: string;
  description: string;
  dspNotes: string;
}

const SAMPLES: SoundSample[] = [
  {
    id: 's-chainsaw',
    name: 'Stihl 2-Stroke Chainsaw (45cc Gas Engine)',
    category: 'chainsaw',
    isThreat: true,
    expectedConfidence: 0.93,
    dominantFreqRange: '1.5 kHz – 3.8 kHz',
    crestFactor: 'High (Pulsed harmonic bursts)',
    description: 'Gasoline combustion exhaust pressure pulses + high-frequency cutting teeth vibrations.',
    dspNotes: 'Triggers primary TinyML 1D-CNN conv filter with harmonic peaks at 2.2 kHz.',
  },
  {
    id: 's-gunshot',
    name: 'Illegal Poaching Rifle (.30-06 Impulse Transient)',
    category: 'gunshot',
    isThreat: true,
    expectedConfidence: 0.88,
    dominantFreqRange: '800 Hz – 4.2 kHz (Wideband shockwave)',
    crestFactor: 'Extremely High (Sharp transient rise < 4ms)',
    description: 'Supersonic projectile acoustic crack followed by muzzle blast reverberation.',
    dspNotes: 'Zero-crossing rate spike and instantaneous energy gradient trigger acoustic alarm.',
  },
  {
    id: 's-vehicle',
    name: 'Heavy Timber Extraction Truck (Diesel Low Idle)',
    category: 'vehicle',
    isThreat: true,
    expectedConfidence: 0.82,
    dominantFreqRange: '120 Hz – 650 Hz (Low rumble)',
    crestFactor: 'Medium (Continuous periodic low-frequency)',
    description: 'Sub-woofer frequency rumble from heavy axles traversing unpaved forest trails.',
    dspNotes: 'Segregated from background wind by steady-state engine RPM harmonic periodicity.',
  },
  {
    id: 's-rain',
    name: 'Monsoon Torrential Rain & Distant Thunder',
    category: 'rain',
    isThreat: false,
    expectedConfidence: 0.06,
    dominantFreqRange: 'Broadband Pink Noise (0 – 12 kHz)',
    crestFactor: 'Low (Diffuse canopy raindrops)',
    description: 'Heavy rain on broad Shorea robusta (Sal) leaves producing diffuse acoustic roar.',
    dspNotes: 'Safely ignored by DSP bandpass; no localized mechanical harmonics detected.',
  },
  {
    id: 's-cicada',
    name: 'Cicada Insect Chorus & Forest Biophony',
    category: 'cicada',
    isThreat: false,
    expectedConfidence: 0.12,
    dominantFreqRange: '5.5 kHz – 8.0 kHz',
    crestFactor: 'Medium (High-frequency resonance)',
    description: 'High-pitch insect stridulation common in Indian tropical moist deciduous zones.',
    dspNotes: 'Operates well above the 1.5–3.5 kHz chainsaw detection band; filtered out by TinyML.',
  },
];

export const SoundStudioPage: React.FC = () => {
  const [selectedSample, setSelectedSample] = useState<SoundSample>(SAMPLES[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);

  // Multi-window inference simulator
  const [windowStep, setWindowStep] = useState(0); // 0 = idle, 1 = w1, 2 = w2, 3 = w3 confirmed
  const [windowConfidences, setWindowConfidences] = useState<number[]>([]);
  const [packetDispatched, setPacketDispatched] = useState(false);

  // Audio Context & Canvas Refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Initialize Web Audio Synthesizer
  const stopAudio = () => {
    if (oscRef.current) {
      try {
        oscRef.current.stop();
        oscRef.current.disconnect();
      } catch (e) {}
      oscRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setIsPlaying(false);
  };

  const playSynthesizedSample = (sample: SoundSample) => {
    stopAudio();

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContextClass();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume * 0.35, ctx.currentTime);
    masterGain.connect(ctx.destination);
    gainRef.current = masterGain;

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyser.connect(masterGain);
    analyserRef.current = analyser;

    if (sample.category === 'chainsaw') {
      // Chainsaw sound: Sawtooth oscillator modulated with pulse jitter and bandpass
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(145, ctx.currentTime);

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2200, ctx.currentTime);
      filter.Q.setValueAtTime(3.5, ctx.currentTime);

      // Low frequency modulation for engine idle RPM pulsing
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(28, ctx.currentTime); // ~28 Hz piston stroke
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(40, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      osc.connect(filter);
      filter.connect(analyser);

      osc.start();
      lfo.start();
      oscRef.current = osc;
    } else if (sample.category === 'gunshot') {
      // Gunshot: Noise burst with fast exponential decay
      const bufferSize = ctx.sampleRate * 1.5;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.12));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1800, ctx.currentTime);
      noise.connect(filter);
      filter.connect(analyser);
      noise.start();
      noise.onended = () => setIsPlaying(false);
    } else if (sample.category === 'vehicle') {
      // Diesel truck: Low frequency square wave + sub-bass filter
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(58, ctx.currentTime);
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, ctx.currentTime);
      osc.connect(filter);
      filter.connect(analyser);
      osc.start();
      oscRef.current = osc;
    } else if (sample.category === 'rain') {
      // Rain: White noise with soft lowpass
      const bufferSize = ctx.sampleRate * 3;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, ctx.currentTime);
      filter.Q.setValueAtTime(0.5, ctx.currentTime);
      noise.connect(filter);
      filter.connect(analyser);
      noise.start();
    } else {
      // Cicada: High-pitch sine wave oscillating between 6000 and 7200 Hz
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(6400, ctx.currentTime);
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(14, ctx.currentTime);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(800, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      osc.connect(analyser);
      osc.start();
      lfo.start();
      oscRef.current = osc;
    }

    setIsPlaying(true);
    startVisualizer();
  };

  const startVisualizer = () => {
    if (!canvasRef.current || !analyserRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = '#0E2E21'; // forest-900 background
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.2;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;

        // Gradient from tealbrand-300 to amber-400
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, '#2A9D8F'); // brand teal
        gradient.addColorStop(0.7, '#85B5A1'); // forest-300
        gradient.addColorStop(1, '#F2B84B'); // alert-amber

        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    };
    draw();
  };

  // Run Multi-Window Edge-AI Inference Simulation
  const runEdgeInference = () => {
    setWindowStep(1);
    setPacketDispatched(false);
    const base = selectedSample.expectedConfidence;

    const c1 = Number(Math.min(0.99, Math.max(0.04, base + (Math.random() * 0.06 - 0.03))).toFixed(2));
    const c2 = Number(Math.min(0.99, Math.max(0.04, base + (Math.random() * 0.05 - 0.02))).toFixed(2));
    const c3 = Number(Math.min(0.99, Math.max(0.04, base + (Math.random() * 0.04 - 0.01))).toFixed(2));

    setWindowConfidences([c1]);

    setTimeout(() => {
      setWindowStep(2);
      setWindowConfidences([c1, c2]);
    }, 1200);

    setTimeout(() => {
      setWindowStep(3);
      setWindowConfidences([c1, c2, c3]);
      if (selectedSample.isThreat && c1 >= 0.85 && c2 >= 0.85 && c3 >= 0.85) {
        setPacketDispatched(true);
      }
    }, 2400);
  };

  useEffect(() => {
    return () => stopAudio();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-forest-800" />
            <h1 className="text-xl font-bold text-slate-900">Acoustic Threat Intelligence & Studio Lab</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Test TinyML sound classification pipelines with live Web Audio DSP synthesis and real-time frequency spectrum analysis
          </p>
        </div>

        <span className="px-3 py-1 rounded-full bg-forest-50 border border-forest-200 text-forest-800 font-semibold text-xs flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-forest-700" />
          <span>ESP32-S3 TinyML DSP Simulator</span>
        </span>
      </div>

      {/* Main Studio Console Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Sample Library Selector */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-forest-700" />
            <span>Select Soundscape Profile</span>
          </h3>

          <div className="space-y-2">
            {SAMPLES.map((sample) => {
              const isSelected = selectedSample.id === sample.id;
              return (
                <button
                  key={sample.id}
                  onClick={() => {
                    setSelectedSample(sample);
                    stopAudio();
                    setWindowStep(0);
                    setPacketDispatched(false);
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition-all text-xs space-y-1 ${
                    isSelected
                      ? 'bg-forest-50/80 border-forest-600 shadow-sm'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 truncate">{sample.name}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        sample.isThreat
                          ? 'bg-red-100 text-alert-red'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {sample.isThreat ? 'Threat Signature' : 'Ambient Noise'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{sample.description}</p>
                </button>
              );
            })}
          </div>

          <div className="p-3 bg-tealbrand-50/60 rounded-xl border border-tealbrand-100 text-tealbrand-900 text-[11px] space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-tealbrand-700" />
              <span>Native Audio Synthesis</span>
            </p>
            <p className="text-tealbrand-800">
              Audio is synthesized live in-browser using Web Audio API oscillators and filter banks to demonstrate acoustic signatures without external network media requests.
            </p>
          </div>
        </div>

        {/* Center / Right: Live Oscilloscope Canvas & Inference Lab */}
        <div className="lg:col-span-2 space-y-5">
          {/* Audio Player & Spectrum Visualizer Card */}
          <div className="bg-forest-900 rounded-2xl p-5 text-white shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-tealbrand-300 uppercase tracking-wider">
                  Real-Time Fast Fourier Transform (FFT)
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">{selectedSample.name}</h3>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    if (isPlaying) {
                      stopAudio();
                    } else {
                      playSynthesizedSample(selectedSample);
                    }
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs shadow-md transition-all active:scale-95 ${
                    isPlaying
                      ? 'bg-alert-red hover:bg-red-600 text-white'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                  }`}
                >
                  {isPlaying ? <Square className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-slate-950" />}
                  <span>{isPlaying ? 'Halt Audio' : 'Play Acoustic Sound'}</span>
                </button>
              </div>
            </div>

            {/* Canvas Spectrum Display */}
            <div className="relative rounded-xl overflow-hidden border border-forest-700 bg-forest-950">
              <canvas
                ref={canvasRef}
                width={560}
                height={160}
                className="w-full h-40 block"
              />
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-forest-950/60 backdrop-blur-2xs text-slate-400 text-xs">
                  Click "Play Acoustic Sound" to activate frequency spectrum analyzer
                </div>
              )}
            </div>

            {/* Sample DSP Profile Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
              <div className="p-2.5 rounded-lg bg-forest-800/80 border border-forest-700">
                <p className="text-[10px] text-forest-300 font-bold uppercase">Dominant Band</p>
                <p className="font-semibold text-white mt-0.5">{selectedSample.dominantFreqRange}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-forest-800/80 border border-forest-700">
                <p className="text-[10px] text-forest-300 font-bold uppercase">Crest Factor</p>
                <p className="font-semibold text-white mt-0.5 truncate">{selectedSample.crestFactor}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-forest-800/80 border border-forest-700">
                <p className="text-[10px] text-forest-300 font-bold uppercase">Expected Confidence</p>
                <p className="font-semibold text-amber-300 mt-0.5">
                  {Math.round(selectedSample.expectedConfidence * 100)}% Match
                </p>
              </div>
            </div>
          </div>

          {/* Multi-Window Edge-AI Confirmation Laboratory */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Layers className="w-4 h-4 text-forest-700" />
                  <span>Multi-Window Sliding Confirmation Laboratory</span>
                </h3>
                <p className="text-xs text-slate-500">
                  VanRakshak mandates 3 consecutive 1.5-second windows ≥ 0.85 confidence to trigger an IN865 radio transmission
                </p>
              </div>

              <button
                onClick={runEdgeInference}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-forest-800 hover:bg-forest-900 text-white font-semibold text-xs rounded-xl shadow-xs transition-all active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Run 3-Window Inference</span>
              </button>
            </div>

            {/* 3 Windows Visual Progress */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[1, 2, 3].map((step) => {
                const isEvaluated = windowStep >= step;
                const conf = windowConfidences[step - 1];
                const passed = conf !== undefined && conf >= 0.85;

                return (
                  <div
                    key={step}
                    className={`p-4 rounded-xl border transition-all text-xs space-y-2 ${
                      !isEvaluated
                        ? 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                        : passed
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                        : 'bg-red-50 border-red-200 text-red-950'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold uppercase tracking-wider text-[10px]">
                        Window {step} (1.5s)
                      </span>
                      {isEvaluated && (
                        <span
                          className={`font-mono font-extrabold text-sm ${
                            passed ? 'text-emerald-700' : 'text-alert-red'
                          }`}
                        >
                          {Math.round((conf || 0) * 100)}%
                        </span>
                      )}
                    </div>

                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          passed ? 'bg-emerald-600' : 'bg-red-500'
                        }`}
                        style={{ width: isEvaluated ? `${(conf || 0) * 100}%` : '0%' }}
                      />
                    </div>

                    <p className="text-[10px] leading-relaxed">
                      {!isEvaluated
                        ? 'Awaiting sliding window...'
                        : passed
                        ? '✓ Threshold ≥ 85% satisfied'
                        : '✕ Below threshold (suppressed)'}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* LoRa Transmission Result Banner */}
            {windowStep === 3 && (
              <div
                className={`p-4 rounded-xl border flex items-start gap-3 transition-all animate-in fade-in ${
                  packetDispatched
                    ? 'bg-forest-50 border-forest-300 text-forest-950'
                    : 'bg-amber-50 border-amber-200 text-amber-950'
                }`}
              >
                {packetDispatched ? (
                  <CheckCircle2 className="w-5 h-5 text-forest-700 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                )}
                <div className="text-xs space-y-1">
                  <p className="font-bold text-slate-900">
                    {packetDispatched
                      ? 'LoRa IN865 Event Alert Packet Transmitted!'
                      : 'LoRa Transmission Suppressed (False-Alarm Mitigation Active)'}
                  </p>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    {packetDispatched
                      ? 'All 3 sliding windows confirmed high-confidence chainsaw harmonics. Compact 24-byte LoRa packet dispatched to gateway on 865.0625 MHz (SF7/BW125).'
                      : 'Audio signature failed to sustain 3 consecutive windows above 0.85. Packet transmission suppressed to save node battery and eliminate ranger false dispatches.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
