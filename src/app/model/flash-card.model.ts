export type ScriptType = 'hiragana' | 'katakana' | 'kanji';
export type CardType = 'character' | 'vocabulary';

export interface FlashCard {
  id: string;
  type: CardType;
  script?: ScriptType;
  term: string;
  reading?: string;
  meaning?: string;
  show: boolean;
}

export const CARD_TYPE_LABEL: Record<CardType, string> = {
  character: 'Ký tự',
  vocabulary: 'Từ vựng',
};
