import React, { useState, useEffect } from 'react';
import { X, Volume2, VolumeX, Eye, HelpCircle, BookOpen, Sparkles, Check, User, Heart } from 'lucide-react';
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
  const [nameInput, setNameInput] = useState<string>(settings.userName || 'Mille');
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    setNameInput(settings.userName || 'Mille');
    setSaveMessage(null);
  }, [settings.userName, isOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSaveNameOnly = () => {
    const finalName = nameInput.trim() || 'Mille';
    setNameInput(finalName);
    onSave({ ...settings, userName: finalName });
    sound.playSuccessChime();
    setSaveMessage(`Navnet ble oppdatert til «${finalName}»!`);
    setTimeout(() => {
      setSaveMessage(null);
    }, 3000);
  };

  const handleSaveAndClose = () => {
    const finalName = nameInput.trim() || 'Mille';
    onSave({ ...settings, userName: finalName });
    sound.playSuccessChime();
    onClose();
  };

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

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          sound.playPop();
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-3xl bg-white shadow-2xl border border-slate-200/80 animate-in zoom-in-95 duration-150 overflow-hidden">
        {/* Modal Header (Fixed) */}
        <div className="flex items-center justify-between border-b border-slate-100 p-4 sm:p-5 shrink-0 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-800">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Innstillinger & Navn</h3>
              <p className="text-xs text-slate-500 font-medium">Tilpass leseren og leseopplevelsen</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            title="Lukk (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* Reader's Name input */}
          <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <label htmlFor="settings-user-name" className="text-xs sm:text-sm font-extrabold text-amber-950 flex items-center gap-1.5">
                <User className="w-4 h-4 text-amber-600" />
                <span>Hvem leser i dag? (Navn)</span>
              </label>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900 border border-amber-300/60">
                Huskes alltid
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative flex-1">
                <input
                  id="settings-user-name"
                  type="text"
                  value={nameInput}
                  onChange={(e) => {
                    setNameInput(e.target.value);
                    setSaveMessage(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSaveNameOnly();
                    }
                  }}
                  placeholder="Skriv inn navn, f.eks. Mille"
                  maxLength={30}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-amber-300 text-slate-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-2xs"
                />
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={handleSaveNameOnly}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                  title="Lagre navnet nå"
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Lagre navn</span>
                </button>

                {nameInput.trim().toLowerCase() !== 'mille' && (
                  <button
                    type="button"
                    onClick={() => {
                      sound.playPop();
                      setNameInput('Mille');
                      onSave({ ...settings, userName: 'Mille' });
                      setSaveMessage('Satt tilbake til Mille!');
                    }}
                    className="px-3 py-2.5 rounded-xl bg-white hover:bg-amber-100/70 border border-amber-300 text-xs font-bold text-amber-900 cursor-pointer transition-colors"
                    title="Nullstill til Mille"
                  >
                    Mille
                  </button>
                )}
              </div>
            </div>

            {saveMessage ? (
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100/80 px-3 py-1.5 rounded-xl border border-emerald-300 animate-in fade-in">
                <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                <span>{saveMessage}</span>
              </div>
            ) : (
              <p className="text-[11px] text-amber-800 font-medium">
                Skriv inn navnet og trykk <strong>Lagre navn</strong> eller <strong>Enter</strong>. Hele appen, heiaropene og diplomene tilpasses dette navnet!
              </p>
            )}
          </div>

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
              title={settings.soundEnabled ? 'Skru av lyd' : 'Skru på lyd'}
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
              Visuelt tema for {nameInput.trim() || 'leseren'}
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
        </div>

        {/* Modal Sticky Footer (Always visible, cannot be scrolled off-screen) */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 shrink-0 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-xs sm:text-sm transition-all cursor-pointer"
          >
            Avbryt
          </button>
          <button
            type="button"
            onClick={handleSaveAndClose}
            className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-[#3A6B53] hover:bg-[#2C5340] text-white font-extrabold text-xs sm:text-sm shadow transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>Lagre og lukk</span>
          </button>
        </div>
      </div>
    </div>
  );
};
