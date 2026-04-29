import { JapaneseType, JapaneseTypeface } from '../../model/japanese.model';

export type StatConfig = {
  name: string;
  predicate: (item: any) => boolean;
};

export const JapaneseStatConfig: StatConfig[] = [
  {
    name: 'Thẻ Hiragana',
    predicate: (i) => i.typeface === JapaneseTypeface.HIRAGANA && i.type === JapaneseType.CHARACTER,
  },
  {
    name: 'Thẻ Katakana',
    predicate: (i) => i.typeface === JapaneseTypeface.KATAKANA && i.type === JapaneseType.CHARACTER,
  },
  {
    name: 'Thẻ từ vựng',
    predicate: (i) => i.type === JapaneseType.VOCABULARY,
  },
];
