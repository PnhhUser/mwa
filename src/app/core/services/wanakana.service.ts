import { Injectable } from '@angular/core';
import * as wanakana from 'wanakana';

@Injectable({
  providedIn: 'root',
})
export class WanakanaService {
  romajiToHiragana(text: string): string {
    return wanakana.toHiragana(text);
  }

  romajiToKatakana(text: string): string {
    return wanakana.toKatakana(text);
  }
}
