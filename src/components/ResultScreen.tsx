import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, TrendingUp, Sparkles, Award, ArrowRight, RotateCcw, Check, Star } from 'lucide-react';
import { BadgeDef, GeneratedText, SessionRecord } from '../types';
import { sound } from '../utils/audio';

interface ResultScreenProps {
  textData: GeneratedText;
  round1Wpm: number;
  round2Wpm: number;
  existingSessions: SessionRecord[];
  allBadges: BadgeDef[];
  userName?: string;
  onFinishSession: (sessionData: {
    pointsEarned: number;
    praiseText: string;
    rating: number;
  }) => void;
  onRestartNewText: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  textData,
  round1Wpm,
  round2Wpm,
  existingSessions,
  allBadges,
  userName = 'Mille',
  onFinishSession,
  onRestartNewText
}) => {
  const [userRating, setUserRating] = useState<number>(3); // 1 = Ok, 2 = Bra, 3 = Supert!
  const name = userName.trim() || 'Mille';

  const diff = round2Wpm - round1Wpm;
  const percentChange = round1Wpm > 0 ? Math.round((diff / round1Wpm) * 100) : 0;

  // Calculate points breakdown
  let points = 10;
  const bonusReasons: string[] = ['Gjennomført begge leserunder (+10 p)'];

  const isNewType = !existingSessions.some(x => x.type === textData.type);
  if (isNewType) {
    points += 5;
    bonusReasons.push('Utforsket ny teksttype (+5 p)');
  }

  const isNewTopic = !existingSessions.some(x => x.topic === textData.topic);
  if (isNewTopic) {
    points += 5;
    bonusReasons.push('Valgte et nytt tema (+5 p)');
  }

  if (diff > 0) {
    points += 3;
    bonusReasons.push('Framgang i 2. runde (+3 p)');
  }

  // Praise message specifically cheering on the reader
  let praiseText = '';
  if (diff > 5) {
    praiseText = `Strålende repetert lesing, ${name}! Andre runde gikk hele ${diff} ord/min raskere (${percentChange > 0 ? `+${percentChange}%` : ''}). Du flyr gjennom teksten med det herlige smilet ditt!`;
  } else if (diff > 0) {
    praiseText = `Kjempefin innsats, fantastiske ${name}! Andre runde gikk ${diff} ord/min raskere. Flott fokus og herlig flyt!`;
  } else if (diff === 0) {
    praiseText = `Imponerende jevnt tempo, ${name}! Du holdt nøyaktig samme trygge stødighet i begge rundene (${round1Wpm} ord/min).`;
  } else {
    praiseText = `Kjempefint gjennomført, ${name}! Noen ganger leser vi roligere i andre runde for å leve oss ekstra godt inn i handlingen. Du er ${name === 'Mille' ? 'verdens beste jente' : 'en fantastisk leser'}!`;
  }

  // Fire confetti and play fanfare on mount
  useEffect(() => {
    sound.playVictoryFanfare();
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Ignore if confetti fails
    }
  }, []);

  const handleFinish = () => {
    sound.playSuccessChime();
    onFinishSession({
      pointsEarned: points,
      praiseText,
      rating: userRating
    });
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Result Hero Header */}
      <div className="rounded-3xl bg-gradient-to-br from-white via-emerald-50/50 to-teal-50/40 p-6 sm:p-8 border border-white/80 shadow-xl shadow-teal-950/5 backdrop-blur-md text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 text-white text-3xl shadow-lg shadow-amber-500/30 animate-bounce">
          🏆
        </div>

        <h2 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">
          Økten er gjennomført!
        </h2>
        <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto font-medium leading-relaxed">
          {praiseText}
        </p>
      </div>

      {/* Comparative Scoreboard */}
      <div className="rounded-3xl bg-white/95 p-5 sm:p-7 border border-white/80 shadow-xl shadow-slate-900/5 backdrop-blur-md space-y-6">
        <h3 className="text-lg font-bold text-slate-800">
          Resultater for denne økten
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Round 1 */}
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-center">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
              1. runde
            </span>
            <div className="text-4xl font-black text-blue-950 my-1">
              {round1Wpm}
            </div>
            <span className="text-xs text-blue-800/80 font-semibold">ord per minutt</span>
          </div>

          {/* Round 2 */}
          <div className="p-4 rounded-2xl bg-teal-50/80 border border-teal-200 text-center">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
              2. runde (etter tempoøvelse)
            </span>
            <div className="text-4xl font-black text-teal-950 my-1">
              {round2Wpm}
            </div>
            <span className="text-xs text-teal-800/80 font-semibold">ord per minutt</span>
          </div>

          {/* Difference */}
          <div
            className={`p-4 rounded-2xl border text-center ${
              diff > 0
                ? 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
                : diff === 0
                ? 'bg-slate-50 border-slate-200 text-slate-700'
                : 'bg-amber-50/80 border-amber-200 text-amber-950'
            }`}
          >
            <span className="text-xs font-bold uppercase tracking-wider">
              Endring i flyt
            </span>
            <div className="text-4xl font-black my-1 flex items-center justify-center gap-1">
              {diff > 0 && <TrendingUp className="w-6 h-6 text-emerald-600 stroke-[3]" />}
              <span>{diff > 0 ? `+${diff}` : diff}</span>
            </div>
            <span className="text-xs font-semibold">
              {diff > 0 ? `+${percentChange}% raskere!` : diff === 0 ? 'Samme stødige tempo' : 'Roligere tempo'}
            </span>
          </div>
        </div>

        {/* Reward Points Box */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/90">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600 fill-amber-500" />
              <h4 className="text-base font-extrabold text-amber-950">
                Belønning for økten
              </h4>
            </div>
            <span className="text-lg font-black px-3 py-1 rounded-xl bg-amber-500 text-white shadow-xs">
              +{points} poeng
            </span>
          </div>

          <div className="space-y-1.5 text-xs sm:text-sm text-amber-900 font-medium">
            {bonusReasons.map((reason, i) => (
              <div key={i} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                <span>{reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Self-Reflection: How did it feel? */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
          <label className="block text-xs font-bold text-slate-700 mb-2.5">
            Hvordan føltes teksten og lesingen i dag?
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { val: 1, label: 'Litt vrien', icon: '🤔' },
              { val: 2, label: 'Gikk greit', icon: '😊' },
              { val: 3, label: 'Kjempebra!', icon: '🤩' }
            ].map((rating) => (
              <button
                key={rating.val}
                type="button"
                onClick={() => {
                  sound.playPop();
                  setUserRating(rating.val);
                }}
                className={`py-2 px-3 rounded-xl border font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  userRating === rating.val
                    ? 'bg-white border-blue-400 text-blue-950 shadow-md ring-2 ring-blue-500/20'
                    : 'bg-white/60 border-slate-200 text-slate-600 hover:bg-white'
                }`}
              >
                <span className="text-lg">{rating.icon}</span>
                <span>{rating.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={handleFinish}
            className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-teal-600 to-indigo-600 hover:opacity-95 text-white font-extrabold text-base sm:text-lg flex items-center justify-center gap-2.5 shadow-xl shadow-blue-600/25 transition-all cursor-pointer active:scale-[0.99]"
          >
            <Check className="w-5 h-5 stroke-[2.5]" />
            <span>Lagre økten og gå til forside</span>
          </button>

          <button
            type="button"
            onClick={() => {
              handleFinish();
              setTimeout(onRestartNewText, 100);
            }}
            className="py-3.5 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Ta en ny tekst</span>
          </button>
        </div>
      </div>
    </div>
  );
};
