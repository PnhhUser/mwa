export interface JapaneseModel {
  id: string;
  type: JapaneseType;
  typeface: JapaneseTypeface;
  term: string;
  reading: string;
  meaning?: string;
  isShow: boolean;
  romaji?: string;
  note?: string;
  createdAt: string;
  updatedAt?: string;
}

export enum JapaneseType {
  CHARACTER = 1,
  VOCABULARY = 2,
}

export enum JapaneseTypeface {
  HIRAGANA = 1,
  KATAKANA = 2,
  // KANJI = 3,
}

export const CARD_TYPE_LABEL: Record<JapaneseType, string> = {
  [JapaneseType.CHARACTER]: 'Ký tự',
  [JapaneseType.VOCABULARY]: 'Từ vựng',
};
