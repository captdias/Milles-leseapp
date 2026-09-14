// Browser Text-To-Speech helper with Norwegian voice selection
export class TTSHelper {
  private static synth: SpeechSynthesis | null = typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;
  private static currentUtterance: SpeechSynthesisUtterance | null = null;

  public static isSupported(): boolean {
    return !!this.synth;
  }

  public static getNorwegianVoice(): SpeechSynthesisVoice | null {
    if (!this.synth) return null;
    const voices = this.synth.getVoices();
    // Prioritize Norwegian voices (nb-NO, no-NO, nn-NO)
    const norwegian = voices.find(v => v.lang.startsWith('nb') || v.lang.startsWith('no') || v.lang.startsWith('nn'));
    if (norwegian) return norwegian;
    // Fallback to scandinavian or default
    return voices.find(v => v.default) || voices[0] || null;
  }

  public static speak(
    text: string, 
    speed: number = 1.0, 
    onBoundary?: (charIndex: number) => void,
    onEnd?: () => void,
    onError?: (err: any) => void
  ): boolean {
    if (!this.synth) {
      if (onError) onError(new Error('Tale-syntese støttes ikke i denne nettleseren.'));
      return false;
    }

    try {
      this.stop();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'nb-NO';
      utterance.rate = Math.max(0.6, Math.min(1.4, speed));
      utterance.pitch = 1.05; // Slightly friendly, warm pitch for kids

      const voice = this.getNorwegianVoice();
      if (voice) {
        utterance.voice = voice;
      }

      if (onBoundary) {
        utterance.onboundary = (event) => {
          if (event.name === 'word') {
            onBoundary(event.charIndex);
          }
        };
      }

      utterance.onend = () => {
        this.currentUtterance = null;
        if (onEnd) onEnd();
      };

      utterance.onerror = (e) => {
        this.currentUtterance = null;
        console.warn('Speech synthesis utterance error:', e);
        if (onError) onError(e);
      };

      this.currentUtterance = utterance;
      this.synth.speak(utterance);
      return true;
    } catch (err) {
      console.error('Failed to start TTS:', err);
      if (onError) onError(err);
      return false;
    }
  }

  public static stop(): void {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (err) {
        console.warn('Error stopping speech synthesis:', err);
      }
    }
    this.currentUtterance = null;
  }

  public static isSpeaking(): boolean {
    return !!this.synth && this.synth.speaking;
  }
}
