import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, ArrowRight, ArrowLeft, Zap, Gauge, Sparkles, Eye, Palette } from 'lucide-react';
import { GeneratedText } from '../types';
import { getWords } from '../data/texts';
import { sound } from '../utils/audio';

interface PacingScreenProps {
  textData: GeneratedText;
  round1Wpm: number;
  userName?: string;
  onProceedToRound2: () => void;
  onBackToModel: () => void;
}

type HighlighterColor = 'yellow' | 'green' | 'blue';

export const PacingScreen: React.FC<PacingScreenProps> = ({
  textData,
  round1Wpm,
  userName = 'Mille',
  onProceedToRound2,
  onBackToModel
}) => {
  const name = userName.trim() || 'Mille';
  const words = getWords(textData.text);
  
  // Suggested target: 8% higher than round 1, rounded to nearest 5
  const baseSuggested = Math.max(50, Math.min(220, Math.round((Math.max(round1Wpm, 40) * 1.08) / 5) * 5));
  const [targetWpm, setTargetWpm] = useState<number>(baseSuggested);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [colorTheme, setColorTheme] = useState<HighlighterColor>('yellow');
  const [dimPreviousWords, setDimPreviousWords] = useState<boolean>(false);

  const paceTimerRef = useRef<any>(null);
  const activeIndexRef = useRef<number>(-1);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const activeWordSpanRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
    
    // Auto-scroll gently into view if text is tall and overflowed
    if (activeWordSpanRef.current && textContainerRef.current) {
      const container = textContainerRef.current;
      const el = activeWordSpanRef.current;
      const elTop = el.offsetTop;
      const elBottom = elTop + el.offsetHeight;
      const containerTop = container.scrollTop;
      const containerBottom = containerTop + container.clientHeight;

      if (elBottom > containerBottom - 20) {
        container.scrollTo({ top: elTop - 40, behavior: 'smooth' });
      } else if (elTop < containerTop + 20) {
        container.scrollTo({ top: Math.max(0, elTop - 40), behavior: 'smooth' });
      }
    }
  }, [activeIndex]);

  const clearTimer = () => {
    if (paceTimerRef.current) {
      clearInterval(paceTimerRef.current);
      paceTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => clearTimer();
  }, []);

  // Keyboard shortcut: Spacebar to toggle Play/Pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && (e.target as HTMLElement)?.tagName !== 'INPUT' && (e.target as HTMLElement)?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        if (isPlaying) {
          pausePacing();
        } else {
          startPacing();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, targetWpm]);

  const startPacing = (startFromIdx?: number) => {
    clearTimer();
    sound.playPop();
    setIsPlaying(true);

    let nextIdx = startFromIdx !== undefined 
      ? startFromIdx 
      : activeIndexRef.current >= words.length - 1 
      ? 0 
      : activeIndexRef.current + 1;

    if (nextIdx < 0) nextIdx = 0;
    setActiveIndex(nextIdx);

    const intervalMs = (60 / targetWpm) * 1000;

    paceTimerRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const next = prev + 1;
        if (next >= words.length) {
          clearTimer();
          setIsPlaying(false);
          sound.playSuccessChime();
          return words.length - 1;
        }
        return next;
      });
    }, intervalMs);
  };

  const pausePacing = () => {
    sound.playPop();
    clearTimer();
    setIsPlaying(false);
  };

  const resetPacing = () => {
    sound.playPop();
    clearTimer();
    setIsPlaying(false);
    setActiveIndex(-1);
    if (textContainerRef.current) {
      textContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSpeedChange = (newWpm: number) => {
    setTargetWpm(newWpm);
    if (isPlaying) {
      clearTimer();
      const intervalMs = (60 / newWpm) * 1000;
      paceTimerRef.current = setInterval(() => {
        setActiveIndex((prev) => {
          const next = prev + 1;
          if (next >= words.length) {
            clearTimer();
            setIsPlaying(false);
            sound.playSuccessChime();
            return words.length - 1;
          }
          return next;
        });
      }, intervalMs);
    }
  };

  const handleWordClick = (index: number) => {
    sound.playPop();
    setActiveIndex(index);
    if (!isPlaying) {
      startPacing(index);
    }
  };

  // Color styles - 100% rock-solid with NO size change or layout reflow
  const highlightStyles = {
    yellow: {
      active: 'bg-amber-300 text-slate-950 font-medium rounded-md shadow-xs ring-2 ring-amber-400/80',
      pill: 'bg-amber-100 text-amber-900 border-amber-300'
    },
    green: {
      active: 'bg-emerald-300 text-emerald-950 font-medium rounded-md shadow-xs ring-2 ring-emerald-400/80',
      pill: 'bg-emerald-100 text-emerald-900 border-emerald-300'
    },
    blue: {
      active: 'bg-sky-300 text-sky-950 font-medium rounded-md shadow-xs ring-2 ring-sky-400/80',
      pill: 'bg-sky-100 text-sky-900 border-sky-300'
    }
  }[colorTheme];

  const progressPercent = words.length > 0 && activeIndex >= 0 
    ? Math.round(((activeIndex + 1) / words.length) * 100) 
    : 0;

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Top navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            clearTimer();
            sound.playPop();
            onBackToModel();
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 bg-white/80 hover:bg-white border border-slate-200/80 shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Tilbake til modell-lesing</span>
        </button>

        <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
          Steg 3 av 4: Tempoøvelse for {name}
        </span>
      </div>

      {/* Main card */}
      <div className="rounded-3xl bg-white/95 p-5 sm:p-7 border border-white/80 shadow-xl shadow-slate-900/5 backdrop-blur-md space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-purple-600 mb-1">
              <Zap className="w-4 h-4" />
              <span>Rolig øyetrening for god flyt</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
              Visuell tempoøvelse ✨
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Følg den stødige lysmarkøren med øynene. Teksten står helt stille så blikket kan gli behagelig fra ord til ord!
            </p>
          </div>

          {/* Color marker options */}
          <div className="flex items-center gap-1.5 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200 self-start sm:self-auto">
            <span className="text-[11px] font-bold text-slate-500 px-1 flex items-center gap-1">
              <Palette className="w-3 h-3 text-slate-400" />
              Farge:
            </span>
            <button
              type="button"
              onClick={() => { sound.playPop(); setColorTheme('yellow'); }}
              className={`w-6 h-6 rounded-xl bg-amber-300 border transition-all cursor-pointer ${
                colorTheme === 'yellow' ? 'border-amber-600 ring-2 ring-amber-400 scale-110 shadow-xs' : 'border-amber-400 opacity-60'
              }`}
              title="Solgul markør"
            />
            <button
              type="button"
              onClick={() => { sound.playPop(); setColorTheme('green'); }}
              className={`w-6 h-6 rounded-xl bg-emerald-300 border transition-all cursor-pointer ${
                colorTheme === 'green' ? 'border-emerald-600 ring-2 ring-emerald-400 scale-110 shadow-xs' : 'border-emerald-400 opacity-60'
              }`}
              title="Munter grønn markør"
            />
            <button
              type="button"
              onClick={() => { sound.playPop(); setColorTheme('blue'); }}
              className={`w-6 h-6 rounded-xl bg-sky-300 border transition-all cursor-pointer ${
                colorTheme === 'blue' ? 'border-sky-600 ring-2 ring-sky-400 scale-110 shadow-xs' : 'border-sky-400 opacity-60'
              }`}
              title="Himmelblå markør"
            />
          </div>
        </div>

        {/* Speed Comparison stat cards */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
          <div className="p-3 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-xs font-bold text-slate-500">1. runde</span>
            <div className="text-2xl sm:text-3xl font-black text-slate-700 mt-0.5">{round1Wpm}</div>
            <span className="text-[10px] text-slate-500 font-semibold">ord/min</span>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-purple-50/80 border border-purple-200 text-center">
            <span className="text-xs font-bold text-purple-700">Foreslått mål (+8%)</span>
            <div className="text-2xl sm:text-3xl font-black text-purple-900 mt-0.5">{baseSuggested}</div>
            <span className="text-[10px] text-purple-600 font-semibold">ord/min</span>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-teal-50/80 border border-teal-200 text-center">
            <span className="text-xs font-bold text-teal-700">Valgt øvingstempo</span>
            <div className="text-2xl sm:text-3xl font-black text-teal-900 mt-0.5">{targetWpm}</div>
            <span className="text-[10px] text-teal-600 font-semibold">ord/min</span>
          </div>
        </div>

        {/* Speed Control & Presets */}
        <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-purple-600" />
              Tilpass tempoet for Mille:
            </span>
            <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-purple-600 text-white shadow-xs">
              {targetWpm} ord per minutt
            </span>
          </div>

          <input
            type="range"
            min={40}
            max={220}
            step={5}
            value={targetWpm}
            onChange={(e) => handleSpeedChange(Number(e.target.value))}
            className="w-full accent-purple-600 cursor-pointer h-2.5 bg-slate-200 rounded-lg"
          />

          {/* Preset buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-slate-500 font-semibold mr-1">Hurtigvalg:</span>
              {[
                { label: 'Rolig (60)', val: 60 },
                { label: `Runde 1 (${round1Wpm})`, val: round1Wpm },
                { label: `Foreslått (${baseSuggested})`, val: baseSuggested },
                { label: `Friskt (+15)`, val: baseSuggested + 15 }
              ].map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSpeedChange(p.val)}
                  className={`px-2.5 py-1 rounded-xl border font-bold transition-all cursor-pointer ${
                    targetWpm === p.val
                      ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Dim past words toggle */}
            <button
              type="button"
              onClick={() => setDimPreviousWords(!dimPreviousWords)}
              className={`text-xs px-2.5 py-1 rounded-xl border font-bold transition-all cursor-pointer ${
                dimPreviousWords
                  ? 'bg-purple-100 text-purple-900 border-purple-300'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
              title="Gjør ord som allerede er lest litt lysere"
            >
              Dempe leste ord: {dimPreviousWords ? 'PÅ' : 'AV'}
            </button>
          </div>
        </div>

        {/* Dynamic Pacing Text Box - Completely rock-solid with NO wavy font-weight or scale reflow */}
        <div
          ref={textContainerRef}
          className="relative p-5 sm:p-7 rounded-2xl bg-amber-50/15 border border-slate-200/90 shadow-inner text-xl sm:text-2xl leading-[2.1] sm:leading-[2.3] select-none min-h-[220px] max-h-[360px] overflow-y-auto"
        >
          {words.map((word, idx) => {
            const isActive = activeIndex === idx;
            const isPassed = activeIndex > idx;

            return (
              <span
                key={idx}
                ref={isActive ? (el) => { activeWordSpanRef.current = el; } : null}
                onClick={() => handleWordClick(idx)}
                className={`inline-block px-1 py-0.5 rounded cursor-pointer transition-colors duration-100 mx-[2px] ${
                  isActive
                    ? highlightStyles.active
                    : isPassed && dimPreviousWords
                    ? 'text-slate-400 hover:text-slate-800'
                    : 'text-slate-800 hover:bg-slate-100/80'
                }`}
                title="Klikk for å starte herfra"
              >
                {word}
              </span>
            );
          })}
        </div>

        {/* Progress indicator bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>
              {activeIndex >= 0 ? `Ord ${activeIndex + 1} av ${words.length}` : 'Klar til start'}
            </span>
            <span className="font-bold text-purple-700">
              {progressPercent}% fullført
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-teal-500 transition-all duration-200"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Interactive Pacing Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
          {!isPlaying ? (
            <button
              type="button"
              onClick={() => startPacing()}
              className="py-3 px-6 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-base flex items-center gap-2 shadow-lg shadow-purple-600/25 transition-all cursor-pointer active:scale-95"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>{activeIndex >= 0 ? 'Fortsett tempoøvelse' : 'Start tempoøvelse'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={pausePacing}
              className="py-3 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-base flex items-center gap-2 shadow-lg shadow-amber-500/25 transition-all cursor-pointer active:scale-95"
            >
              <Pause className="w-5 h-5 fill-white" />
              <span>Pause</span>
            </button>
          )}

          <button
            type="button"
            onClick={resetPacing}
            className="py-3 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-sm border border-slate-200 flex items-center gap-1.5 transition-all cursor-pointer"
            title="Start fra første ord igjen"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Fra start</span>
          </button>
        </div>

        <p className="text-center text-xs text-slate-500 font-medium">
          💡 Tips til {name}: Du kan trykke på et hvilket som helst ord for å hoppe rett dit, eller bruke <strong>mellomromstasten</strong> for pause!
        </p>

        {/* Proceed to Round 2 button */}
        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => {
              clearTimer();
              sound.playSuccessChime();
              onProceedToRound2();
            }}
            className="w-full sm:w-auto py-4 px-8 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-base sm:text-lg flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-600/25 transition-all cursor-pointer active:scale-[0.99]"
          >
            <span>Klar! Les teksten igjen (2. runde) ✨</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
