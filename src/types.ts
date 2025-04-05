export interface UserData {
  name: string;
  dictionaries: Dictionary[];
}

export interface Dictionary {
  id: string;
  sourceLanguage: string;
  targetLanguage: string;
  words: WordEntry[];
}

export interface WordEntry {
  id: string;
  word: string;
  translation: string;
  meaning?: string;
  phonetics?: string;
  timestamp: string;
  dictionaryId: string;
}
