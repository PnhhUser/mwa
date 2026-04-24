import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SpeechService {
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    this.loadVoices();
  }

  private loadVoices() {
    this.voices = speechSynthesis.getVoices();

    // fix bug voices rỗng
    speechSynthesis.onvoiceschanged = () => {
      this.voices = speechSynthesis.getVoices();
    };
  }

  speak(text: string, lang: string = 'ja-JP') {
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;

    const voice = this.voices.find((v) => v.lang === lang);
    if (voice) {
      utterance.voice = voice;
    }

    speechSynthesis.speak(utterance);
  }

  stop() {
    speechSynthesis.cancel();
  }
}
