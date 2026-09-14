import React from 'react';
import { X, Volume2, VolumeX, Eye, HelpCircle, BookOpen, Sparkles, Check } from 'lucide-react';
import { UserSettings } from '../types';
import { sound } from '../utils/audio';

interface SettingsModalProps {
  settings: UserSettings;
  isOpen: boolean;
  onClose: () => void;
  onSave: (newSettings: UserSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  isOpen,
  onClose,
  onSave
}) => {
  if (!isOpen) return null;

  const handleToggleSound = () => {
    const next = !settings.soundEnabled;
    sound.enabled = next;
    if (next) sound.playPop();
    onSave({ ...settings, soundEnabled: next });
  };

  const handleToggleRuler = () => {
    sound.playPop();
    onSave({ ...settings, rulerEnabled: !settings.rulerEnabled });
  };

  const handleToggleDyslexic = () => {
    sound.playPop();
    onSave({ ...settings, dyslexicFont: !settings.dyslexicFont });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-slate-200/80 space-y-5 animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-800">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Innstillinger & Veiledning</h3>
              <p className="text-xs text-slate-500 font-medium">Tilpass opplevelsen i Leseflyt</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {/* Sound toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-3">
              {settings.soundEnabled ? (
                <Volume2 className="w-5 h-5 text-teal-600" />
              ) : (
                <VolumeX className="w-5 h-5 text-slate-400" />
              )}
              <div>
                <div className="text-xs sm:text-sm font-extrabold text-slate-800">Lydeffekter</div>
                <div className="text-[11px] text-slate-500">Muntre melodier, klikkelyder og seiersfanfare</div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleToggleSound}
              className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${
                settings.soundEnabled ? 'bg-teal-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                  settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Visual Theme Selection */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="text-xs sm:text-sm font-extrabold text-slate-800">
              Visuelt tema for Mille
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  sound.playPop();
                  onSave({ ...settings, theme: 'nordic' });
                }}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  (settings.theme || 'nordic') === 'nordic'
                    ? 'bg-[#3A6B53] text-white border-[#3A6B53] shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="text-base mb-0.5">📖</div>
                <div className="text-xs font-bold">Bokkos</div>
                <div className={`text-[10px] leading-tight mt-0.5 ${(settings.theme || 'nordic') === 'nordic' ? 'text-white/80' : 'text-slate-400'}`}>
                  Varmt papir & ro
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playPop();
                  onSave({ ...settings, theme: 'sunshine' });
                }}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  settings.theme === 'sunshine'
                    ? 'bg-pink-600 text-white border-pink-600 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="text-base mb-0.5">🌸</div>
                <div className="text-xs font-bold">Solskinn</div>
                <div className={`text-[10px] leading-tight mt-0.5 ${settings.theme === 'sunshine' ? 'text-white/80' : 'text-slate-400'}`}>
                  Muntre pasteller
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playPop();
                  onSave({ ...settings, theme: 'evening' });
                }}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  settings.theme === 'evening'
                    ? 'bg-indigo-700 text-white border-indigo-700 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="text-base mb-0.5">🌙</div>
                <div className="text-xs font-bold">Måneskinn</div>
                <div className={`text-[10px] leading-tight mt-0.5 ${settings.theme === 'evening' ? 'text-white/80' : 'text-slate-400'}`}>
                  Rolig kveldslesing
                </div>
              </button>
            </div>
          </div>

          {/* Reading ruler default */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-amber-600" />
              <div>
                <div className="text-xs sm:text-sm font-extrabold text-slate-800">Leselinjal som standard</div>
                <div className="text-[11px] text-slate-500">Fokuslinje som følger pekeren over teksten</div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleToggleRuler}
              className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${
                settings.rulerEnabled ? 'bg-teal-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                  settings.rulerEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Pedagogical info box */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-teal-50/50 border border-blue-200/70 text-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-blue-900 font-extrabold text-xs">
            <BookOpen className="w-4 h-4" />
            <span>Hvorfor to runder og tempoøvelse?</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Forskning viser at <strong>repetert lesing</strong> (å lese samme tekst to ganger med en modell eller tempoøvelse mellom) er en av de mest effektive metodene for å øke leseflyt, ordgjenkjenning og leseglede hos barn og unge.
          </p>
        </div>

        {/* Close button */}
        <button
          type="button"
          onClick={() => {
            sound.playPop();
            onClose();
          }}
          className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-sm transition-all cursor-pointer"
        >
          Lukk innstillinger
        </button>
      </div>
    </div>
  );
};
