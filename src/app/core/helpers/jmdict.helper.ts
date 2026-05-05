import { TagDefinitionMap, TermEntry } from '../../model/jmdict.model';

export function parseJMdictEntry(rawData: any[]): TermEntry {
  const parseTags = (tagData: any): string[] => {
    if (Array.isArray(tagData)) return tagData;
    if (typeof tagData === 'string' && tagData.trim() !== '') {
      return tagData.trim().split(' ');
    }
    return [];
  };

  const extractStringsDeep = (input: any): string[] => {
    if (typeof input === 'string') {
      return [input];
    }

    if (Array.isArray(input)) {
      return input.flatMap((item) => extractStringsDeep(item));
    }

    if (input && typeof input === 'object') {
      if ('text' in input) return extractStringsDeep(input.text);
      if ('content' in input) return extractStringsDeep(input.content);

      return Object.values(input).flatMap((value) => extractStringsDeep(value));
    }

    return [];
  };

  const parseMeanings = (meaningData: any): string[] => {
    if (!Array.isArray(meaningData)) return [];

    return meaningData.map((item) => {
      const pieces = extractStringsDeep(item);

      const cleanText = pieces
        .map((p) => p.trim())
        .filter(Boolean)
        .join('; ');

      return cleanText || JSON.stringify(item);
    });
  };

  return {
    expression: String(rawData[0] || ''),
    reading: String(rawData[1] || ''),

    tags: parseTags(rawData[2]),

    rules: rawData[3] === '' ? null : rawData[3],
    score: Number(rawData[4]) || 0,

    meanings: parseMeanings(rawData[5]),

    sequence: Number(rawData[6]) || 0,

    termTags: parseTags(rawData[7]),
  };
}

export function parseJMdictTagBank(rawTags: any[][]): TagDefinitionMap {
  const tagMap: TagDefinitionMap = {};

  for (const rawTag of rawTags) {
    const name = String(rawTag[0] || '');

    if (name) {
      tagMap[name] = {
        name: name,
        category: String(rawTag[1] || ''),
        sorting: Number(rawTag[2]) || 0,
        description: String(rawTag[3] || ''),
        score: Number(rawTag[4]) || 0,
      };
    }
  }

  return tagMap;
}
