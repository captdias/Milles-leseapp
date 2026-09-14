import React, { useState } from 'react';
import { 
  Sparkles, RefreshCw, ArrowLeft, Play, FileText, BookOpen, 
  HelpCircle, AlertCircle, Edit3, Check
} from 'lucide-react';
import { DifficultyLevel, GeneratedText, TextCategory, TopicKey } from '../types';
import { TOPIC_METADATA, generateTextSafely, countWords } from '../data/texts';
import { sound } from '../utils/audio';

interface SetupScreenProps {
  onStartRound: (generated: GeneratedText) => void;
  onBack: () => void;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({ onStartRound, onBack }) => {
  const [tab, setTab] = useState<'preset' | 'custom'>('preset');
  const [category, setCategory] = useState<'mixed' | TextCategory>('mixed');
  const [topic, setTopic] = useState<'random' | TopicKey>('random');
  const [length, setLength] = useState<number>(110);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');

  // Custom text tab states
  const [customTitle, setCustomTitle] = useState('');
  const [customBody, setCustomBody] = useState('');
  const [customError, setCustomError] = useState<string | null>(null);

  // Preview generated text
  const [currentText, setCurrentText] = useState<GeneratedText | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleGenerate = () => {
    sound.playPop();
    setIsGenerating(true);
    setTimeout(() => {
      const generated = generateTextSafely({
        category,
        topic,
        length,
        difficulty
      });
      setCurrentText(generated);
      setIsGenerating(false);
    }, 150);
  };

  const handleUseCustomText = () => {
    const trimmed = customBody.trim();
    const wCount = countWords(trimmed);

    if (!trimmed) {
      setCustomError('Vennligst lim inn eller skriv litt tekst først.');
      return;
    }
    if (wCount < 20) {
      setCustomError(`Teksten er litt for kort (${wCount} ord). Den bør ha minst 20 ord for god 1-minutt lesetrening.`);
      return;
    }

    setCustomError(null);
    sound.playPop();

    const customGenerated: GeneratedText = {
      id: 'custom_' + Date.now(),
      title: customTitle.trim() || 'Egendefinert tekst',
      text: trimmed,
      type: 'fiction',
      topic: 'everyday',
      difficulty: 'medium',
      targetWords: wCount,
      wordCount: wCount,
      isCustom: true
    };

    onStartRound(customGenerated);
  };

  const handleStartRound = () => {
    if (currentText) {
      sound.playSuccessChime();
      onStartRound(currentText);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-150">
      {/* Back button and title */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            sound.playPop();
            onBack();
          }}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold text-slate-600 bg-white/80 hover:bg-white border border-slate-200/80 shadow-xs transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Tilbake til forside</span>
        </button>

        {/* Tab switch between Generator and Custom text */}
        <div className="flex items-center bg-slate-200/80 p-1 rounded-2xl border border-slate-300/60 text-xs font-bold">
          <button
            type="button"
            onClick={() => setTab('preset')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              tab === 'preset' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tekstgenerator
          </button>
          <button
            type="button"
            onClick={() => setTab('custom')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              tab === 'custom' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Lim inn egen tekst
          </button>
        </div>
      </div>

      {/* Main setup container */}
      {tab === 'preset' ? (
        <div className="rounded-3xl bg-white/85 p-5 sm:p-7 border border-white/80 shadow-xl shadow-slate-900/5 backdrop-blur-md space-y-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
              Velg dagens tekst
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              Tilpass sjanger, tema og vanskelighetsgrad for å trene på akkurat det du har lyst til i dag.
            </p>
          </div>

          {/* 1. Category selector */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2.5">
              1. Hva slags type tekst vil du lese?
            </label>
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
              {[
                { id: 'mixed', label: 'Blandet', desc: 'Overraskelse', icon: '🎲' },
                { id: 'fact', label: 'Faktatekst', desc: 'Virkeligheten', icon: '🌍' },
                { id: 'fiction', label: 'Fortelling', desc: 'Spenning og fantasi', icon: '📖' }
              ].map((item) => {
                const selected = category === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      sound.playPop();
                      setCategory(item.id as any);
                    }}
                    className={`p-3 sm:p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                      selected
                        ? 'bg-gradient-to-br from-blue-50 to-teal-50 border-blue-400 text-blue-950 shadow-md ring-2 ring-blue-500/20'
                        : 'bg-white/80 border-slate-200/90 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{item.icon}</div>
                    <div className="font-extrabold text-sm sm:text-base">{item.label}</div>
                    <div className="text-[11px] text-slate-500 font-medium">{item.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Topic grid */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                2. Velg et spennende tema
              </label>
              <button
                type="button"
                onClick={() => setTopic('random')}
                className="text-xs font-bold text-teal-700 hover:underline"
              >
                Tilfeldig tema
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-2.5">
              {/* Random topic button */}
              <button
                type="button"
                onClick={() => {
                  sound.playPop();
                  setTopic('random');
                }}
                className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                  topic === 'random'
                    ? 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-400 text-purple-950 ring-2 ring-purple-500/20 shadow-xs'
                    : 'bg-white/90 border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <span className="text-xl">✨</span>
                <div>
                  <div className="font-bold text-xs sm:text-sm">Tilfeldig</div>
                  <div className="text-[10px] text-slate-500">Variert moro</div>
                </div>
              </button>

              {/* All topic metadata keys */}
              {(Object.keys(TOPIC_METADATA) as TopicKey[]).map((key) => {
                const meta = TOPIC_METADATA[key];
                const selected = topic === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      sound.playPop();
                      setTopic(key);
                    }}
                    className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                      selected
                        ? 'bg-gradient-to-br from-blue-50 to-teal-50 border-teal-400 text-teal-950 ring-2 ring-teal-500/20 shadow-xs'
                        : 'bg-white/90 border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xl">{meta.icon}</span>
                    <div>
                      <div className="font-bold text-xs sm:text-sm truncate">{meta.label}</div>
                      <div className="text-[10px] text-slate-500 truncate">{meta.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Length and Difficulty */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-2 border-t border-slate-100">
            {/* Word count length */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                Tekstlengde (ca. ordantall)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[90, 110, 130, 150].map((num) => {
                  const selected = length === num;
                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => {
                        sound.playPop();
                        setLength(num);
                      }}
                      className={`py-2 px-1 text-center rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                        selected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {num} ord
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Difficulty level */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                Språknivå
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'easy', label: 'Lett', desc: 'Enkle ord' },
                  { id: 'medium', label: 'Middels', desc: 'Anbefalt' },
                  { id: 'challenge', label: 'Utfordring', desc: 'Rikt ordforråd' }
                ].map((diff) => {
                  const selected = difficulty === diff.id;
                  return (
                    <button
                      key={diff.id}
                      type="button"
                      onClick={() => {
                        sound.playPop();
                        setDifficulty(diff.id as DifficultyLevel);
                      }}
                      className={`py-2 px-1 text-center rounded-xl border transition-all cursor-pointer ${
                        selected
                          ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="text-xs sm:text-sm font-bold">{diff.label}</div>
                      <div className={`text-[10px] ${selected ? 'text-teal-100' : 'text-slate-500'}`}>
                        {diff.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action trigger: Generate */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-teal-600 to-indigo-600 text-white font-black text-base sm:text-lg flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
            >
              <Sparkles className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Lager tekst...' : 'Lag ny tekst'}</span>
            </button>
          </div>
        </div>
      ) : (
        /* Custom text tab */
        <div className="rounded-3xl bg-white/85 p-5 sm:p-7 border border-white/80 shadow-xl shadow-slate-900/5 backdrop-blur-md space-y-4">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
              Lim inn din egen leselekse
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              Har du en tekst fra skolen eller en bok du vil øve på? Lim den inn her!
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Tittel (valgfritt)
            </label>
            <input
              type="text"
              placeholder="F.eks. Kapittel 3 eller Dagens lekse"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white text-sm"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700">
                Tekst
              </label>
              <span className="text-xs font-bold text-slate-500">
                {countWords(customBody)} ord
              </span>
            </div>
            <textarea
              rows={7}
              placeholder="Lim inn teksten her..."
              value={customBody}
              onChange={(e) => {
                setCustomBody(e.target.value);
                if (customError) setCustomError(null);
              }}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white text-sm sm:text-base leading-relaxed"
            />
          </div>

          {customError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{customError}</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleUseCustomText}
            className="w-full py-3.5 px-6 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-md shadow-teal-600/20 transition-all cursor-pointer"
          >
            <Check className="w-5 h-5" />
            <span>Bruk denne teksten i økten</span>
          </button>
        </div>
      )}

      {/* Generated text preview card */}
      {currentText && tab === 'preset' && (
        <div className="rounded-3xl bg-gradient-to-b from-white to-sky-50/30 p-5 sm:p-7 border border-blue-200/80 shadow-xl shadow-blue-900/5 animate-in slide-in-from-bottom-3 duration-200 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-teal-600">
                Klar for lesing
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-800">
                {currentText.title}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {currentText.type === 'fact' ? 'Fakta 🌍' : 'Fortelling 📖'}
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                {currentText.wordCount} ord
              </span>
            </div>
          </div>

          {/* Text preview box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-inner text-slate-800 text-base sm:text-lg leading-relaxed max-h-56 overflow-y-auto">
            {currentText.text}
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={handleStartRound}
              className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-base sm:text-lg flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer active:scale-[0.99]"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>Start 1. runde med denne teksten</span>
            </button>

            <button
              type="button"
              onClick={handleGenerate}
              className="py-3.5 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Lag en annen variant</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
