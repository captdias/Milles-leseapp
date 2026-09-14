import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, BookOpen, Settings, Heart, Flame, Moon, Sun, BookMarked } from 'lucide-react';
import { LevelInfo, UserSettings } from '../types';
import { sound } from '../utils/audio';
import { FUN_MILLE_QUOTES } from '../utils/encouragements';

interface HeaderProps {
  level: LevelInfo;
  points: number;
  streak: number;
  completedToday: boolean;
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
  onOpenSettings: () => void;
  onHomeClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  level,
  points,
  streak,
  completedToday,
  settings,
  onUpdateSettings,
  onOpenSettings,
  onHomeClick
}) => {
  const [mascotBubble, setMascotBubble] = useState<string | null>(null);
  const currentTheme = settings.theme || 'nordic';

  const handleMascotClick = () => {
    sound.playPop();
    const quote = FUN_MILLE_QUOTES[Math.floor(Math.random() * FUN_MILLE_QUOTES.length)];
    setMascotBubble(quote);
    setTimeout(() => setMascotBubble(null), 4000);
  };

  const toggleSound = () => {
    const next = !settings.soundEnabled;
    sound.enabled = next;
    if (next) sound.playPop();
    onUpdateSettings({ ...settings, soundEnabled: next });
  };

  const handleThemeChange = (newTheme: 'nordic' | 'sunshine' | 'evening') => {
    sound.playPop();
    onUpdateSettings({ ...settings, theme: newTheme });
  };

  // Header styles per theme
  const headerCardStyles = {
    nordic: 'bg-[#FFFFFF] border-[#E8DFC0]/80 shadow-[0_4px_24px_-4px_rgba(50,40,30,0.06)] text-[#2C241E]',
    sunshine: 'bg-white/90 border-pink-200/80 shadow-lg shadow-pink-500/5 text-slate-800',
    evening: 'bg-[#1A202E] border-[#2A3449] shadow-xl shadow-black/20 text-[#E4E9F2]'
  }[currentTheme];

  const logoIconBg = {
    nordic: 'bg-[#3A6B53] text-[#FAF6EE] shadow-sm',
    sunshine: 'bg-gradient-to-br from-pink-500 via-purple-500 to-amber-500 text-white shadow-md shadow-pink-500/20',
    evening: 'bg-[#374151] text-amber-300 border border-amber-400/30'
  }[currentTheme];

  return (
    <header className={`relative mb-6 rounded-3xl border p-4 sm:p-5 transition-colors duration-200 flex flex-wrap items-center justify-between gap-4 ${headerCardStyles}`}>
      {/* Brand & Mascot */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onHomeClick}
          className="group text-left flex items-center gap-3 transition-transform hover:scale-[1.01] active:scale-95 focus:outline-none cursor-pointer"
          title="Gå til forsiden for Mille"
        >
          <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-3 ${logoIconBg}`}>
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-editorial font-bold tracking-tight">
                Milles Leseflyt
              </h1>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full hidden sm:inline-flex items-center gap-1 ${
                currentTheme === 'evening'
                  ? 'bg-amber-950/80 text-amber-300 border border-amber-700/60'
                  : currentTheme === 'nordic'
                  ? 'bg-[#F2EFE8] text-[#4A3E34] border border-[#DDD4C5]'
                  : 'bg-pink-100 text-pink-900 border border-pink-200'
              }`}>
                <span>✨</span>
                <span>Verdens beste jente</span>
              </span>
            </div>
            <p className={`text-xs font-medium ${currentTheme === 'evening' ? 'text-slate-400' : 'text-stone-500'}`}>
              En liten leseøkt hver dag – trygt, rolig og gøy!
            </p>
          </div>
        </button>

        {/* Mascot Avatar */}
        <div className="relative hidden md:block ml-1">
          <button
            type="button"
            onClick={handleMascotClick}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold transition-all shadow-2xs group cursor-pointer ${
              currentTheme === 'evening'
                ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-750'
                : 'bg-amber-50 hover:bg-amber-100/80 border-amber-200 text-amber-900'
            }`}
            title="Klikk på ugla Flyt for et heiarop!"
          >
            <span className="text-base group-hover:scale-125 transition-transform inline-block">🦉</span>
            <span>Heia Mille!</span>
          </button>

          {mascotBubble && (
            <div className="absolute top-10 left-0 z-30 w-64 p-3 bg-stone-900 text-stone-100 text-xs font-semibold rounded-2xl shadow-xl animate-in fade-in zoom-in-95 duration-150 border border-stone-700">
              <div className="absolute -top-1.5 left-5 w-3 h-3 bg-stone-900 rotate-45 border-l border-t border-stone-700" />
              {mascotBubble}
            </div>
          )}
        </div>
      </div>

      {/* Center/Right Controls: Theme Selector + User Progress + Settings */}
      <div className="flex items-center gap-2 sm:gap-2.5 ml-auto">
        {/* Visual Theme Selector (3 Styles) */}
        <div className={`flex items-center p-1 rounded-2xl border text-xs font-bold ${
          currentTheme === 'evening'
            ? 'bg-slate-800/90 border-slate-700 text-slate-300'
            : currentTheme === 'nordic'
            ? 'bg-[#F4F0E8] border-[#E2DAD0] text-[#55493F]'
            : 'bg-slate-100 border-slate-200 text-slate-700'
        }`}>
          <button
            type="button"
            onClick={() => handleThemeChange('nordic')}
            className={`px-2 py-1 rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
              currentTheme === 'nordic'
                ? 'bg-[#3A6B53] text-white shadow-xs'
                : 'hover:opacity-75'
            }`}
            title="Nordisk bokkos: Varmt papir, skogsgrønn og ro"
          >
            <span>📖</span>
            <span className="hidden lg:inline text-[11px]">Bokkos</span>
          </button>
          <button
            type="button"
            onClick={() => handleThemeChange('sunshine')}
            className={`px-2 py-1 rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
              currentTheme === 'sunshine'
                ? 'bg-pink-500 text-white shadow-xs'
                : 'hover:opacity-75'
            }`}
            title="Solskinn: Muntert, lyst og fargerikt"
          >
            <span>🌸</span>
            <span className="hidden lg:inline text-[11px]">Solskinn</span>
          </button>
          <button
            type="button"
            onClick={() => handleThemeChange('evening')}
            className={`px-2 py-1 rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
              currentTheme === 'evening'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'hover:opacity-75'
            }`}
            title="Måneskinn: Rolig og mørk kveldsmodus"
          >
            <span>🌙</span>
            <span className="hidden lg:inline text-[11px]">Kveld</span>
          </button>
        </div>

        {/* Daily Streak Badge */}
        <div 
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border text-xs font-bold shadow-2xs ${
            streak > 0
              ? currentTheme === 'evening'
                ? 'bg-amber-950/60 border-amber-800 text-amber-300'
                : 'bg-amber-50 border-amber-200 text-amber-950'
              : currentTheme === 'evening'
              ? 'bg-slate-800 border-slate-700 text-slate-400'
              : 'bg-stone-50 border-stone-200 text-stone-600'
          }`}
          title={streak > 0 ? `${streak} dager på rad!` : 'Start dagsrutinen i dag!'}
        >
          <Flame className={`w-4 h-4 ${streak > 0 ? 'text-amber-500 fill-amber-500' : 'text-stone-400'}`} />
          <span>{streak > 0 ? `${streak} d` : '0 d'}</span>
          {completedToday && <span className="text-emerald-500 font-extrabold">✓</span>}
        </div>

        {/* Level chip */}
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border text-xs font-bold ${
          currentTheme === 'evening'
            ? 'bg-slate-800 border-slate-700 text-slate-200'
            : currentTheme === 'nordic'
            ? 'bg-[#FAF6EE] border-[#E8DFC0] text-[#3D3228]'
            : 'bg-purple-50 border-purple-200 text-purple-950'
        }`}>
          <span>{level.badge}</span>
          <span className="truncate max-w-[70px] sm:max-w-none">{level.name}</span>
          <span className="font-extrabold text-amber-600">{points}p</span>
        </div>

        {/* Sound toggle */}
        <button
          type="button"
          onClick={toggleSound}
          className={`p-2 rounded-2xl border transition-all cursor-pointer ${
            settings.soundEnabled 
              ? currentTheme === 'evening'
                ? 'bg-blue-950/60 border-blue-800 text-blue-300'
                : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100' 
              : currentTheme === 'evening'
              ? 'bg-slate-800 border-slate-700 text-slate-500'
              : 'bg-stone-100 border-stone-200 text-stone-400 hover:text-stone-600'
          }`}
          title={settings.soundEnabled ? 'Lyd er på' : 'Lyd er dempet'}
        >
          {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Settings button */}
        <button
          type="button"
          onClick={onOpenSettings}
          className={`p-2 rounded-2xl border transition-all cursor-pointer ${
            currentTheme === 'evening'
              ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
              : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
          }`}
          title="Innstillinger"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
