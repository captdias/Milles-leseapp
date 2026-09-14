import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Square, ArrowRight, ArrowLeft, HeartHandshake, Sparkles } from 'lucide-react';
import { GeneratedText } from '../types';
import { TTSHelper } from '../utils/tts';
import { sound } from '../utils/audio';

interface ModelReadingScreenProps {
  textData: GeneratedText;
  onProceedToPacer: () => void;
  onBackToMark: () => void;
}

export const ModelReadingScreen: React.FC<ModelReadingScreenProps> = ({
  textData,
  onProceedToPacer,
  onBackToMark
}) => {
  const [isPlayingTTS, setIsPlayingTTS] = useState<boolean>(false);
  const [ttsSpeed, setTtsSpeed] = useState<number>(1.0);
  const [ttsSupported, setTtsSupported] = useState<boolean>(true);
  const [ttsMessage, setTtsMessage] = useState<string | null>(null);

  useEffect(() => {
    setTtsSupported(TTSHelper.isSupported());
    return () => {
      TTSHelper.stop();
    };
  }, []);

  const handleStartTTS = () => {
    sound.playPop();
    setIsPlayingTTS(true);
    setTtsMessage(null);

    const success = TTSHelper.speak(
      textData.text,
      ttsSpeed,
      undefined,
      () => {
        setIsPlayingTTS(false);
        sound.playSuccessChime();
      },
      (err) => {
        setIsPlayingTTS(false);
        setTtsMessage('Kunne ikke spille av stemmen på denne enheten. Les gjerne høyt sammen med en voksen!');
      }
    );

    if (!success) {
      setIsPlayingTTS(false);
    }
  };

  const handleStopTTS = () => {
    TTSHelper.stop();
    setIsPlayingTTS(false);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Top navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            handleStopTTS();
            sound.playPop();
            onBackToMark();
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 bg-white/80 hover:bg-white border border-slate-200/80 shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Tilbake</span>
        </button>

        <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
          Steg 2 av 4: Modell-lesing
        </span>
      </div>

      {/* Main card */}
      <div className="rounded-3xl bg-white/95 p-5 sm:p-7 border border-white/80 shadow-xl shadow-slate-900/5 backdrop-blur-md space-y-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-teal-600 mb-1">
            <HeartHandshake className="w-4 h-4" />
            <span>Fokus på flyt og innlevelse</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
            Modell-lesing
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Her skal teksten leses med god ro og naturlig flyt. Følg teksten med øynene mens du lytter!
          </p>
        </div>

        {/* Informative advice banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50 via-teal-50 to-emerald-50 border border-teal-200 text-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="text-2xl p-2 rounded-xl bg-white/80 border border-teal-200/60 shadow-xs">
              👨‍🏫
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900">La en voksen lese høyt – eller bruk stemmen</h4>
              <p className="text-xs text-slate-600 font-medium mt-0.5 leading-relaxed">
                Legg merke til hvordan stemmen senkes ved punktum og hvordan ordene henger naturlig sammen.
              </p>
            </div>
          </div>

          {/* Built-in Text-To-Speech controls */}
          {ttsSupported && (
            <div className="flex items-center gap-2 self-stretch sm:self-auto bg-white/90 p-2 rounded-2xl border border-teal-200 shadow-xs">
              {!isPlayingTTS ? (
                <button
                  type="button"
                  onClick={handleStartTTS}
                  className="py-2 px-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Spill av teksten med norsk tale"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Lytt til oppleser</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStopTTS}
                  className="py-2 px-3.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Square className="w-4 h-4 fill-white" />
                  <span>Stopp tale</span>
                </button>
              )}

              {/* Speed selector */}
              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-600 px-1">
                {[0.8, 1.0, 1.2].map((spd) => (
                  <button
                    key={spd}
                    type="button"
                    onClick={() => {
                      setTtsSpeed(spd);
                      if (isPlayingTTS) {
                        handleStopTTS();
                      }
                    }}
                    className={`px-1.5 py-1 rounded-md transition-all cursor-pointer ${
                      ttsSpeed === spd
                        ? 'bg-teal-100 text-teal-900 font-extrabold'
                        : 'hover:bg-slate-100 text-slate-500'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {ttsMessage && (
          <div className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200 font-medium">
            {ttsMessage}
          </div>
        )}

        {/* Text presentation */}
        <div className="p-5 sm:p-7 rounded-2xl bg-amber-50/20 border border-slate-200/80 shadow-inner text-xl sm:text-2xl leading-loose sm:leading-[2.1] text-slate-800">
          {textData.text}
        </div>

        {/* Next step button */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={() => {
              handleStopTTS();
              sound.playSuccessChime();
              onProceedToPacer();
            }}
            className="w-full sm:w-auto py-3.5 px-7 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
          >
            <span>Videre til visuell tempoøvelse</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
