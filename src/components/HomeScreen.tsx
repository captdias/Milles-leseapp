import React, { useState } from 'react';
import { 
  Play, Award, BarChart3, ArrowRight, Flame, Sparkles, Check, 
  ChevronRight, Heart, RefreshCw, Star, Sun, BookOpen, Compass
} from 'lucide-react';
import { BadgeDef, LevelInfo, SessionRecord } from '../types';
import { DayStatus } from '../utils/storage';
import { getMilleCheer } from '../utils/encouragements';
import { sound } from '../utils/audio';

interface HomeScreenProps {
  level: LevelInfo;
  nextLevel: LevelInfo | null;
  points: number;
  streak: number;
  completedToday: boolean;
  weekDays: DayStatus[];
  sessions: SessionRecord[];
  badges: BadgeDef[];
  theme?: 'nordic' | 'sunshine' | 'evening';
  userName?: string;
  onOpenSettings?: () => void;
  onStartSetup: () => void;
  onViewBadges: () => void;
  onViewStats: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  level,
  nextLevel,
  points,
  streak,
  completedToday,
  weekDays,
  sessions,
  badges,
  theme = 'nordic',
  userName = 'Mille',
  onOpenSettings,
  onStartSetup,
  onViewBadges,
  onViewStats
}) => {
  const name = userName.trim() || 'Mille';

  const progressPercent = nextLevel
    ? Math.max(0, Math.min(100, Math.round(((points - level.min) / (nextLevel.min - level.min)) * 100)))
    : 100;

  const pointsNeeded = nextLevel ? Math.max(0, nextLevel.min - points) : 0;
  const lastSession = sessions.length > 0 ? sessions[sessions.length - 1] : null;

  const [cheer, setCheer] = useState(() => getMilleCheer(sessions, streak, completedToday, name));

  // Update cheer if name or sessions change
  React.useEffect(() => {
    setCheer(getMilleCheer(sessions, streak, completedToday, name));
  }, [sessions, streak, completedToday, name]);

  const handleRefreshCheer = () => {
    sound.playPop();
    setCheer(getMilleCheer(sessions, streak, completedToday, name));
  };

  // Theme-specific styles
  const isDark = theme === 'evening';
  const isNordic = theme === 'nordic';

  const cardBase = isDark
    ? 'bg-[#1A202E] border-[#2A3449] text-[#E4E9F2]'
    : isNordic
    ? 'bg-[#FFFFFF] border-[#E8DFC0]/80 shadow-[0_4px_24px_-4px_rgba(50,40,30,0.06)] text-[#2C241E]'
    : 'bg-white/95 border-pink-200/80 shadow-lg shadow-pink-500/5 text-slate-800';

  const subtleBox = isDark
    ? 'bg-slate-800/80 border-slate-700'
    : isNordic
    ? 'bg-[#F9F7F1] border-[#EBE4D5]'
    : 'bg-slate-50 border-slate-200';

  return (
    <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-200">
      {/* Warm Welcome & Invitation Banner */}
      <div className={`relative overflow-hidden rounded-3xl border p-6 sm:p-7 ${
        isDark
          ? 'bg-gradient-to-br from-[#1C2538] via-[#1E293B] to-[#25203D] border-[#334155] text-white shadow-xl shadow-black/20'
          : isNordic
          ? 'bg-[#F5EFE6] border-[#DFD5C4] text-[#2C241E] shadow-sm'
          : 'bg-gradient-to-r from-pink-500 via-purple-500 to-amber-500 text-white shadow-xl shadow-purple-900/10'
      }`}>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 flex-wrap mb-2.5">
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide ${
                isDark
                  ? 'bg-amber-950/70 text-amber-300 border border-amber-800/60'
                  : isNordic
                  ? 'bg-[#EAE2D3] text-[#4A3E34] border border-[#DDD3C2]'
                  : 'bg-white/20 text-pink-100'
              }`}>
                <Heart className={`w-3.5 h-3.5 ${isNordic ? 'text-[#D35E35] fill-[#D35E35]' : 'fill-current'}`} />
                <span>{name === 'Mille' ? 'Verdens beste jente • Livsglad, blid & hjelpsom' : 'Superleser • Livsglad, blid & lærevillig'}</span>
              </div>

              {onOpenSettings && (
                <button
                  type="button"
                  onClick={() => {
                    sound.playPop();
                    onOpenSettings();
                  }}
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border transition-all cursor-pointer ${
                    isDark
                      ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-600'
                      : isNordic
                      ? 'bg-[#EAE2D3]/60 hover:bg-[#EAE2D3] text-[#4A3E34] border-[#DDD3C2]'
                      : 'bg-white/20 hover:bg-white/30 text-white border-white/40'
                  }`}
                  title="Klikk her for å endre navnet"
                >
                  Endre navn ({name})
                </button>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-editorial font-bold tracking-tight leading-snug">
              Hei, herlige {name}! 🌿
            </h2>

            <p className={`text-sm sm:text-base mt-2 font-normal leading-relaxed ${
              isDark ? 'text-slate-300' : isNordic ? 'text-[#5C5046]' : 'text-pink-100'
            }`}>
              En liten leseøkt hver dag er alt som skal til for å bygge superkrefter og flyt i hjernen. To korte 1-minutts runder – rolig, trygt og fullt av mestring!
            </p>
          </div>

          {/* Quick Streak Card */}
          <div className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border self-start md:self-auto shrink-0 ${
            isDark
              ? 'bg-slate-800/90 border-slate-700'
              : isNordic
              ? 'bg-[#FFFFFF] border-[#E3D9C9] shadow-xs'
              : 'bg-white/20 backdrop-blur-md border-white/30 text-white'
          }`}>
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl shadow-xs ${
              isNordic ? 'bg-[#F5E6CC] text-amber-800' : 'bg-gradient-to-br from-amber-400 to-orange-500 text-white'
            }`}>
              🔥
            </div>
            <div>
              <div className={`text-[10px] font-extrabold uppercase tracking-wider ${
                isDark ? 'text-slate-400' : isNordic ? 'text-[#7A6D61]' : 'text-pink-100'
              }`}>
                Dagsrutine
              </div>
              <div className="text-base font-extrabold font-editorial">
                {streak > 0 ? `${streak} dager på rad` : 'Start dag 1 i dag!'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dagens heiarop (Encouragement styled like an authentic warm bookmark) */}
      <div className={`rounded-3xl border p-5 sm:p-6 transition-all ${
        isDark
          ? 'bg-[#1D2536] border-[#2A3449]'
          : isNordic
          ? 'bg-[#FFFDF9] border-[#E8DFC0]/90 shadow-[0_2px_16px_-2px_rgba(60,50,40,0.04)]'
          : 'bg-amber-50/70 border-amber-200/90'
      }`}>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{cheer.emoji}</span>
            <div>
              <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                isDark
                  ? 'bg-amber-950 text-amber-300 border border-amber-800/60'
                  : isNordic
                  ? 'bg-[#F2EFE8] text-[#55473B] border border-[#DDD3C2]'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                Dagens heiarop til {name}
              </span>
              <h3 className="text-base sm:text-lg font-editorial font-bold mt-0.5">
                {cheer.headline}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRefreshCheer}
            className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
                : isNordic
                ? 'bg-[#FFFFFF] border-[#E3D9C9] text-[#4A3E34] hover:bg-[#F9F6F0]'
                : 'bg-white border-amber-200 text-amber-800 hover:bg-amber-50'
            }`}
            title={`Få et nytt heiarop til ${name}`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Nytt heiarop</span>
          </button>
        </div>

        <div className={`mt-2 pl-3 border-l-2 ${
          isDark ? 'border-amber-500/60 text-slate-200' : isNordic ? 'border-[#D35E35]/80 text-[#3C3229]' : 'border-amber-400 text-slate-800'
        }`}>
          <p className="text-sm sm:text-base font-medium leading-relaxed italic">
            "{cheer.quote}"
          </p>
          <p className={`text-xs font-semibold mt-1 ${isDark ? 'text-amber-400/90' : isNordic ? 'text-[#8A5A2B]' : 'text-amber-800'}`}>
            ✨ {cheer.subtext}
          </p>
        </div>
      </div>

      {/* Main 2-Column: Weekly Routine Tracker & Primary Session Launcher */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Ukas dagsrytme (Mandag - Søndag) */}
        <div className={`rounded-3xl border p-5 sm:p-6 flex flex-col justify-between space-y-4 ${cardBase}`}>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <h3 className="text-lg font-editorial font-bold flex items-center gap-2">
                <Sun className={`w-5 h-5 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
                Ukas dagsrytme
              </h3>
              <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${
                completedToday
                  ? isDark
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                    : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                  : isDark
                  ? 'bg-amber-950/80 text-amber-300 border-amber-800'
                  : 'bg-amber-100 text-amber-800 border-amber-200'
              }`}>
                {completedToday ? 'I dag: Gjennomført! 🎉' : 'I dag: Gjenstår ⭐'}
              </span>
            </div>
            <p className={`text-xs font-medium mb-4 ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
              {name}s ukeoversikt: Hver lille økt gjør neste dag enda lettere.
            </p>

            {/* 7-Day Visual Row */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {weekDays.map((day) => {
                return (
                  <div
                    key={day.dayName}
                    className={`rounded-2xl p-2 text-center border transition-all flex flex-col items-center justify-between min-h-[66px] ${
                      day.completed
                        ? isDark
                          ? 'bg-emerald-950/40 border-emerald-700 text-emerald-200'
                          : isNordic
                          ? 'bg-[#EBF4EE] border-[#C3DEC9] text-[#1E4B35] font-bold'
                          : 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                        : day.isToday
                        ? isDark
                          ? 'bg-blue-950/40 border-blue-600 text-blue-200 ring-1 ring-blue-500/40'
                          : isNordic
                          ? 'bg-[#FAF4EB] border-[#D8C7AD] text-[#4A3E34] ring-2 ring-[#D35E35]/30'
                          : 'bg-blue-50 border-blue-300 text-blue-950 ring-2 ring-blue-400/30'
                        : isDark
                        ? 'bg-slate-800/40 border-slate-700 text-slate-500'
                        : 'bg-[#FAF8F5] border-[#EAE3D6] text-stone-400'
                    }`}
                  >
                    <span className="text-[11px] font-extrabold">{day.shortName}</span>
                    <div className="my-1">
                      {day.completed ? (
                        <div className={`w-5 h-5 rounded-full text-white flex items-center justify-center text-xs shadow-2xs ${
                          isNordic ? 'bg-[#2E6B4F]' : 'bg-emerald-500'
                        }`}>
                          ✓
                        </div>
                      ) : day.isToday ? (
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          isNordic ? 'bg-[#D35E35] text-white animate-pulse' : 'bg-blue-500 text-white animate-pulse'
                        }`}>
                          ●
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-dashed border-stone-300 flex items-center justify-center text-[10px] text-stone-300">
                          -
                        </div>
                      )}
                    </div>
                    <span className="text-[9px] font-bold">
                      {day.isToday ? 'I dag' : ''}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <p className={`text-xs p-3 rounded-2xl border font-medium leading-relaxed ${subtleBox}`}>
            {completedToday
              ? `Dagens lille økt er i boks, ${name}! Fantastisk innsats! Du kan ta en bonus-økt hvis du har lyst, eller bare smile og nyte resten av dagen.`
              : 'En kort økt på noen få minutter holder lesegleden varm og gir hjernen en god opplevelse!'}
          </p>
        </div>

        {/* Primary Action Card: Start Dagens Økt */}
        <div className={`relative overflow-hidden rounded-3xl border p-5 sm:p-6 flex flex-col justify-between group ${
          isDark
            ? 'bg-gradient-to-br from-[#1F293D] via-[#1E273A] to-[#2C2140] border-[#3B4863] text-white shadow-xl shadow-black/20'
            : isNordic
            ? 'bg-gradient-to-br from-[#2D5A47] via-[#244C3B] to-[#1E3F31] border-[#2A5240] text-white shadow-lg shadow-[#1E3F31]/20'
            : 'bg-gradient-to-br from-blue-600 via-teal-600 to-purple-700 text-white shadow-xl shadow-blue-600/20'
        }`}>
          <div>
            <span className={`inline-block text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full mb-2.5 ${
              isNordic ? 'bg-white/15 text-[#DFF0E6]' : 'bg-white/20 text-pink-100'
            }`}>
              {completedToday ? 'Klar for en ny tekst?' : 'Dagens anbefaling'}
            </span>

            <h3 className="text-2xl sm:text-3xl font-editorial font-bold tracking-tight text-white mb-2">
              {completedToday ? 'Ta en tekst til!' : 'Start dagens lille økt'}
            </h3>

            <p className={`text-xs sm:text-sm leading-relaxed mb-4 font-normal ${
              isNordic ? 'text-[#D5EADF]' : 'text-blue-100/90'
            }`}>
              Velg et morsomt tema som dyr, magi, verdensrommet eller mysterier. To korte 1-minutts runder med modell-lesing og rolig tempoøvelse imellom!
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playPop();
              onStartSetup();
            }}
            className={`w-full mt-3 py-4 px-6 rounded-2xl font-extrabold text-base sm:text-lg flex items-center justify-center gap-2.5 shadow-lg transition-all cursor-pointer active:scale-[0.98] ${
              isNordic
                ? 'bg-[#F7EFE4] text-[#1D4030] hover:bg-white'
                : 'bg-white text-purple-950 hover:bg-pink-50'
            }`}
          >
            <Play className="w-5 h-5 fill-current" />
            <span>{completedToday ? 'Velg ny tekst' : 'Start dagens økt nå ✨'}</span>
            <ArrowRight className="w-5 h-5 ml-1" />
          </button>
        </div>
      </div>

      {/* Lesetittel & Poengoversikt */}
      <div className={`relative overflow-hidden rounded-3xl border p-5 sm:p-6 space-y-3.5 ${cardBase}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className={`inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider ${
              isDark ? 'text-slate-400' : 'text-stone-500'
            }`}>
              <span>{level.badge}</span>
              <span>{name}s lesetittel</span>
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <h2 className="text-2xl sm:text-3xl font-editorial font-bold">
                {level.name}
              </h2>
              <span className={`text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
                — {level.title}
              </span>
            </div>
          </div>

          <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border shadow-2xs self-start sm:self-auto ${
            isDark
              ? 'bg-slate-800 border-slate-700 text-amber-300'
              : isNordic
              ? 'bg-[#FAF6EE] border-[#E8DFC0] text-[#4A3E34]'
              : 'bg-amber-50 border-amber-200 text-amber-950'
          }`}>
            <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400" />
            <span className="text-xl font-extrabold font-editorial">{points}</span>
            <span className="text-xs font-bold text-amber-700">poeng samlet</span>
          </div>
        </div>

        {/* Level Progress Bar */}
        <div>
          <div className={`h-3 w-full rounded-full overflow-hidden p-0.5 border shadow-inner ${
            isDark ? 'bg-slate-800 border-slate-700' : 'bg-[#F2ECE1] border-[#E3D9C9]'
          }`}>
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                isNordic
                  ? 'bg-gradient-to-r from-[#2F6B50] to-[#E5973A]'
                  : `bg-gradient-to-r ${level.color}`
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className={`flex items-center justify-between text-xs font-semibold mt-2 ${
            isDark ? 'text-slate-400' : 'text-stone-500'
          }`}>
            <span>{level.min} p</span>
            {nextLevel ? (
              <span className={`font-bold ${isDark ? 'text-amber-300' : isNordic ? 'text-[#2D5A47]' : 'text-purple-700'}`}>
                {pointsNeeded} poeng til {nextLevel.badge} {nextLevel.name} ({progressPercent}%)
              </span>
            ) : (
              <span className="text-emerald-600 font-bold">Høyeste nivå nådd! 👑</span>
            )}
            <span>{nextLevel ? `${nextLevel.min} p` : 'Maks'}</span>
          </div>
        </div>
      </div>

      {/* Badges Preview */}
      <div className={`rounded-3xl border p-5 sm:p-6 ${cardBase}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-editorial font-bold flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              {name}s hedersmerker
            </h3>
            <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
              Samle hedersmerker ved å lese litt hver dag og heie på deg selv!
            </p>
          </div>
          <button
            type="button"
            onClick={onViewBadges}
            className={`inline-flex items-center gap-1 text-xs font-bold transition-colors p-1.5 cursor-pointer ${
              isDark ? 'text-amber-300 hover:text-amber-200' : isNordic ? 'text-[#2D5A47] hover:text-[#1E3F31]' : 'text-purple-700 hover:text-purple-900'
            }`}
          >
            <span>Se alle ({badges.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {badges.slice(0, 4).map((badge) => {
            const unlocked = badge.test(sessions);
            return (
              <div
                key={badge.id}
                className={`rounded-2xl p-3.5 border transition-all flex flex-col justify-between ${
                  unlocked
                    ? isDark
                      ? 'bg-slate-800/80 border-amber-500/40 text-white'
                      : isNordic
                      ? 'bg-[#FFFDF9] border-[#E8DFC0] shadow-2xs'
                      : 'bg-white border-amber-200 shadow-2xs'
                    : isDark
                    ? 'bg-slate-800/30 border-slate-700/60 opacity-50'
                    : 'bg-[#FAF8F5] border-stone-200 opacity-60'
                }`}
              >
                <div>
                  <div className="text-2xl mb-1.5">{badge.icon}</div>
                  <h4 className="font-bold text-xs sm:text-sm line-clamp-1">{badge.name}</h4>
                  <p className={`text-[11px] leading-tight mt-1 line-clamp-2 ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
                    {badge.desc}
                  </p>
                </div>
                <div className="mt-3">
                  <span
                    className={`inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      unlocked
                        ? isDark
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : isDark
                        ? 'bg-slate-700 text-slate-400'
                        : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {unlocked ? 'Låst opp ✓' : 'Låst'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lesekurve & Statistikk */}
      <div className={`rounded-3xl border p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${cardBase}`}>
        <div>
          <h3 className="text-lg font-editorial font-bold flex items-center gap-2">
            <BarChart3 className={`w-5 h-5 ${isDark ? 'text-teal-400' : 'text-teal-600'}`} />
            {name}s lesekurve
          </h3>
          <p className={`text-xs sm:text-sm mt-1 font-medium ${isDark ? 'text-slate-300' : 'text-stone-600'}`}>
            {sessions.length > 0
              ? `${sessions.length} økter fullført. Siste økt ga ${lastSession?.r2} ord/min (${lastSession?.diff !== undefined && lastSession.diff >= 0 ? `+${lastSession.diff}` : lastSession?.diff} i 2. runde).`
              : 'Ingen økter lagret ennå. Ta dagens første økt for å se kurven stige!'}
          </p>
        </div>

        <button
          type="button"
          onClick={onViewStats}
          className={`w-full sm:w-auto py-2.5 px-4 rounded-xl border text-sm font-bold shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
            isDark
              ? 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-200'
              : isNordic
              ? 'bg-[#FFFFFF] hover:bg-[#FAF6EE] border-[#E0D6C5] text-[#3D3328]'
              : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-stone-400" />
          <span>Åpne statistikk og graf</span>
        </button>
      </div>
    </div>
  );
};
