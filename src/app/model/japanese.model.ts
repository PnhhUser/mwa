export interface JapaneseModel {
  id: string;
  type: JapaneseType;
  typeface: JapaneseTypeface;
  kanaType: KanaType;
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
  KANJI = 3,
}

export enum KanaType {
  Seion = 6, // 清音 - âm thường (か)
  Dakuon = 1, // 濁音 - có dakuten (が)
  Handakuon = 2, // 半濁音 - có handakuten (ぱ)
  Yoon = 3, // 拗音 - âm ghép (きゃ)
  Sokuon = 4, // 促音 - っ
  SmallKana = 5, // ゃ, ゅ, ょ
  Default = 0,
}

export const CARD_TYPE_LABEL: Record<JapaneseType, string> = {
  [JapaneseType.CHARACTER]: 'Ký tự',
  [JapaneseType.VOCABULARY]: 'Từ vựng',
};
