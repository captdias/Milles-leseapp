import React, { useState } from 'react';
import { ArrowLeft, Award, Sparkles, Check, Lock, Star } from 'lucide-react';
import { BadgeDef, SessionRecord } from '../types';
import { sound } from '../utils/audio';

interface BadgesScreenProps {
  badges: BadgeDef[];
  sessions: SessionRecord[];
  onBack: () => void;
}

export const BadgesScreen: React.FC<BadgesScreenProps> = ({
  badges,
  sessions,
  onBack
}) => {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  const unlockedCount = badges.filter(b => b.test(sessions)).length;

  const filteredBadges = badges.filter(b => {
    const isUnlocked = b.test(sessions);
    if (filter === 'unlocked') return isUnlocked;
    if (filter === 'locked') return !isUnlocked;
    return true;
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            sound.playPop();
            onBack();
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 bg-white/80 hover:bg-white border border-slate-200/80 shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Tilbake til forside</span>
        </button>

        {/* Filter pills */}
        <div className="flex items-center bg-slate-200/80 p-1 rounded-2xl border border-slate-300/60 text-xs font-bold">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded-xl transition-all ${
              filter === 'all' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Alle ({badges.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('unlocked')}
            className={`px-2.5 py-1 rounded-xl transition-all ${
              filter === 'unlocked' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
            }`}
          >
            Låst opp ({unlockedCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('locked')}
            className={`px-2.5 py-1 rounded-xl transition-all ${
              filter === 'locked' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-600'
            }`}
          >
            Gjenstår ({badges.length - unlockedCount})
          </button>
        </div>
      </div>

      {/* Main card */}
      <div className="rounded-3xl bg-white/95 p-5 sm:p-7 border border-white/80 shadow-xl shadow-slate-900/5 backdrop-blur-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-600 mb-1">
              <Award className="w-4 h-4" />
              <span>Samling og bragder</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
              Dine lesemerker
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Du låser opp nye merker gjennom jevn innsats, variasjon i sjangre og mestring!
            </p>
          </div>

          {/* Progress pill */}
          <div className="px-4 py-2.5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 text-amber-950 flex items-center gap-3">
            <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
            <div>
              <div className="text-sm font-black">{unlockedCount} av {badges.length} samlet</div>
              <div className="text-[10px] text-amber-800/80 font-bold uppercase tracking-wider">
                {Math.round((unlockedCount / badges.length) * 100)}% fullført
              </div>
            </div>
          </div>
        </div>

        {/* Badge Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {filteredBadges.map((badge) => {
            const isUnlocked = badge.test(sessions);

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  isUnlocked
                    ? 'bg-gradient-to-br from-white via-amber-50/40 to-orange-50/20 border-amber-200 shadow-sm'
                    : 'bg-slate-50/70 border-slate-200/80 opacity-60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-xs ${
                    isUnlocked ? 'bg-amber-100 border border-amber-200' : 'bg-slate-200 border border-slate-300 grayscale'
                  }`}>
                    {badge.icon}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-extrabold text-sm text-slate-800">{badge.name}</h4>
                      {isUnlocked && <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />}
                    </div>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed mt-0.5">
                      {badge.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {badge.category}
                  </span>
                  <span
                    className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
                      isUnlocked
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isUnlocked ? 'Låst opp ✓' : 'Låst'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
