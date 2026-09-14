import React, { useState } from 'react';
import { CheckCircle2, ArrowRight, ArrowLeft, MousePointerClick, Sparkles } from 'lucide-react';
import { GeneratedText } from '../types';
import { getWords } from '../data/texts';
import { sound } from '../utils/audio';

interface MarkingScreenProps {
  round: 1 | 2;
  textData: GeneratedText;
  elapsedSeconds: number;
  onConfirmWordCount: (count: number, wpm: number) => void;
  onBackToRead: () => void;
}

export const MarkingScreen: React.FC<MarkingScreenProps> = ({
  round,
  textData,
  elapsedSeconds,
  onConfirmWordCount,
  onBackToRead
}) => {
  const words = getWords(textData.text);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleWordClick = (index: number) => {
    sound.playPop();
    setSelectedIndex(index);
  };

  const markedWords = selectedIndex !== null ? selectedIndex + 1 : 0;
  // Calculate WPM adjusted for elapsed time
  const calculatedWpm = elapsedSeconds > 0
    ? Math.round((markedWords / elapsedSeconds) * 60)
    : markedWords;

  const handleNext = () => {
    if (selectedIndex === null) return;
    sound.playSuccessChime();
    onConfirmWordCount(markedWords, calculatedWpm);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Header instructions */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            sound.playPop();
            onBackToRead();
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 bg-white/80 hover:bg-white border border-slate-200/80 shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Les på nytt</span>
        </button>

        <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
          {round === 1 ? '1. runde markering' : '2. runde markering'}
        </span>
      </div>

      {/* Main card */}
      <div className="rounded-3xl bg-white/95 p-5 sm:p-7 border border-white/80 shadow-xl shadow-slate-900/5 backdrop-blur-md space-y-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-teal-600 mb-1">
            <MousePointerClick className="w-4 h-4" />
            <span>Klikk eller trykk på ordet</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
            Hvor langt kom du?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Trykk på det <strong>aller siste ordet</strong> du rakk å lese før tiden stoppet.
          </p>
        </div>

        {/* Interactive word grid */}
        <div className="p-5 sm:p-7 rounded-2xl bg-amber-50/20 border border-slate-200/80 shadow-inner text-xl sm:text-2xl leading-loose sm:leading-[2.1] select-none">
          {words.map((word, idx) => {
            const isReached = selectedIndex !== null && idx <= selectedIndex;
            const isLast = selectedIndex === idx;

            return (
              <span
                key={idx}
                onClick={() => handleWordClick(idx)}
                className={`inline-block px-1.5 py-0.5 rounded-md cursor-pointer transition-colors duration-100 mx-0.5 ${
                  isLast
                    ? 'bg-amber-300 text-slate-950 font-bold ring-2 ring-amber-400 shadow-xs'
                    : isReached
                    ? 'bg-emerald-100 text-emerald-950 font-medium'
                    : 'hover:bg-blue-100/70 text-slate-800'
                }`}
              >
                {word}
              </span>
            );
          })}
        </div>

        {/* Dynamic calculation result card */}
        {selectedIndex !== null && (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
                <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <div className="text-xs font-extrabold uppercase tracking-wider text-emerald-700">
                  Flott innsats!
                </div>
                <div className="text-base sm:text-lg font-extrabold text-emerald-950">
                  Du leste <strong>{markedWords} ord</strong> {elapsedSeconds < 60 ? `på ${elapsedSeconds} sek` : 'på 1 minutt'}.
                </div>
                <div className="text-xs text-emerald-800/80 font-medium">
                  Det tilsvarer en lesehastighet på <strong>{calculatedWpm} ord i minuttet</strong>.
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="py-3 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all cursor-pointer self-stretch sm:self-auto"
            >
              <span>Gå videre</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
