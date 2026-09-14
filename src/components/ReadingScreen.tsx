import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Sparkles, Eye, Type, Volume2, ArrowLeft } from 'lucide-react';
import { GeneratedText, UserSettings } from '../types';
import { sound } from '../utils/audio';

interface ReadingScreenProps {
  round: 1 | 2;
  textData: GeneratedText;
  settings: UserSettings;
  onFinishReading: (elapsedSeconds: number) => void;
  onCancel: () => void;
}

export const ReadingScreen: React.FC<ReadingScreenProps> = ({
  round,
  textData,
  settings,
  onFinishReading,
  onCancel
}) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [rulerY, setRulerY] = useState<number | null>(null);
  const [showRuler, setShowRuler] = useState<boolean>(settings.rulerEnabled);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('large');

  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<any>(null);

  // Clean interval on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Timer logic with robust intervals
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            sound.playSuccessChime();
            onFinishReading(60);
            return 0;
          }
          if (prev <= 4) {
            sound.playCountdownBeep(prev === 2);
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, onFinishReading]);

  const handleStart = () => {
    sound.playPop();
    setIsRunning(true);
  };

  const handlePause = () => {
    sound.playPop();
    setIsRunning(false);
  };

  const handleStopEarly = () => {
    sound.playPop();
    setIsRunning(false);
    const elapsed = Math.max(1, 60 - secondsLeft);
    onFinishReading(elapsed);
  };

  // Mouse or touch line tracking for reading ruler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!showRuler || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relativeY = e.clientY - rect.top;
    setRulerY(relativeY);
  };

  const fontSizeClass = {
    normal: 'text-lg sm:text-xl leading-relaxed sm:leading-loose',
    large: 'text-xl sm:text-2xl leading-relaxed sm:leading-[1.75]',
    xlarge: 'text-2xl sm:text-3xl leading-loose sm:leading-[1.8]'
  }[fontSize];

  const formattedTime = `00:${String(secondsLeft).padStart(2, '0')}`;
  const timerProgress = ((60 - secondsLeft) / 60) * 100;

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Top action bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            sound.playPop();
            onCancel();
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 bg-white/80 hover:bg-white border border-slate-200/80 shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Avbryt</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Dyslexia / ruler focus bar toggle */}
          <button
            type="button"
            onClick={() => {
              sound.playPop();
              setShowRuler(!showRuler);
            }}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
              showRuler
                ? 'bg-amber-100 border-amber-300 text-amber-900'
                : 'bg-white/80 border-slate-200 text-slate-600 hover:bg-white'
            }`}
            title="Slå på leselinje for å holde fokus"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Leselinjal</span>
          </button>

          {/* Font size toggle */}
          <button
            type="button"
            onClick={() => {
              sound.playPop();
              setFontSize((prev) => (prev === 'normal' ? 'large' : prev === 'large' ? 'xlarge' : 'normal'));
            }}
            className="px-2.5 py-1.5 rounded-xl text-xs font-bold border border-slate-200 bg-white/80 text-slate-700 hover:bg-white flex items-center gap-1.5 cursor-pointer"
            title="Endre skriftstørrelse"
          >
            <Type className="w-3.5 h-3.5" />
            <span>Skrift: {fontSize === 'normal' ? 'Normal' : fontSize === 'large' ? 'Stor' : 'Ekstra'}</span>
          </button>
        </div>
      </div>

      {/* Main Reading Card */}
      <div className="relative rounded-3xl bg-white/95 p-5 sm:p-7 border border-white/80 shadow-xl shadow-slate-900/5 backdrop-blur-md space-y-5">
        {/* Title and Round Pill */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
              {textData.title}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              {round === 1 ? '1. gjennomlesning' : '2. gjennomlesning (repetert lesing)'}
            </p>
          </div>

          <span
            className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold border shadow-xs ${
              round === 1
                ? 'bg-blue-100 text-blue-800 border-blue-200'
                : 'bg-gradient-to-r from-emerald-100 to-teal-100 text-teal-800 border-teal-200'
            }`}
          >
            {round === 1 ? '🎯 1. runde' : '⚡ 2. runde'}
          </span>
        </div>

        {/* Text Area with Interactive Reading Ruler */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setRulerY(null)}
          className={`relative p-5 sm:p-7 rounded-2xl bg-amber-50/20 border border-slate-200/80 shadow-inner select-text ${fontSizeClass} text-slate-800 font-normal tracking-wide min-h-[220px] transition-all overflow-hidden`}
        >
          {/* Subtle guide line / reading ruler */}
          {showRuler && rulerY !== null && (
            <div
              className="pointer-events-none absolute left-0 right-0 h-10 bg-amber-200/30 border-y border-amber-300/40 -translate-y-1/2 transition-all duration-75"
              style={{ top: `${rulerY}px` }}
            />
          )}

          {textData.text}
        </div>

        {/* Timer Box */}
        <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gradient-to-b from-slate-50 to-sky-50/40 border border-slate-200/60 space-y-3">
          <div className="flex items-center gap-3">
            <div
              className={`text-4xl sm:text-5xl font-black tracking-tight font-mono ${
                secondsLeft <= 10 ? 'text-rose-600 animate-pulse' : 'text-slate-800'
              }`}
            >
              {formattedTime}
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {isRunning ? 'Tiden løper...' : secondsLeft === 60 ? 'Klar til start' : 'Pauset'}
            </span>
          </div>

          {/* Progress Bar of Timer */}
          <div className="w-full max-w-md h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-500 to-blue-600 transition-all duration-300"
              style={{ width: `${timerProgress}%` }}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            {!isRunning ? (
              <button
                type="button"
                onClick={handleStart}
                className="py-3 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-base flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>{secondsLeft === 60 ? 'Start 1 minutt' : 'Fortsett'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePause}
                className="py-3 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-base flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              >
                <Pause className="w-5 h-5 fill-white" />
                <span>Pause</span>
              </button>
            )}

            {secondsLeft < 60 && (
              <button
                type="button"
                onClick={handleStopEarly}
                className="py-3 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm flex items-center gap-2 transition-all cursor-pointer"
              >
                <Square className="w-4 h-4 text-slate-600 fill-slate-600" />
                <span>Stopp og tell ord nå</span>
              </button>
            )}
          </div>
        </div>

        {/* Motivational note */}
        <p className="text-center text-xs text-slate-500 font-medium">
          Les i et naturlig og behagelig tempo med god innlevelse. Målet er flyt og mestring!
        </p>
      </div>
    </div>
  );
};
