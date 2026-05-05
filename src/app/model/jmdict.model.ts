export interface TermEntry {
  expression: string;
  reading: string;
  tags: string[];
  rules: string | null;
  score: number;
  meanings: string[];
  sequence: number;
  termTags: string[];
}

export interface TagDefinition {
  name: string;
  category: string;
  sorting: number;
  description: string;
  score: number;
}

export type TagDefinitionMap = Record<string, TagDefinition>;
