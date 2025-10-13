// Common types
export interface TranslatedName {
  language_name: string;
  name: string;
}

export interface Pagination {
  per_page: number;
  current_page: number;
  next_page: number | null;
  total_pages: number;
  total_records: number;
}

// Chapters endpoint types
export interface Chapter {
  id: number;
  revelation_place: string;
  revelation_order: number;
  bismillah_pre: boolean;
  name_simple: string;
  name_complex: string;
  name_arabic: string;
  verses_count: number;
  pages: [number, number];
  translated_name: TranslatedName;
}

export interface ChaptersResponse {
  chapters: Chapter[];
}

// Reciters endpoint types
export interface Recitation {
  id: number;
  reciter_name: string;
  style: string;
  translated_name: TranslatedName;
}

export interface RecitersResponse {
  recitations: Recitation[];
}

// Audio files endpoint types
export interface AudioFile {
  verse_key: string;
  url: string;
}

export interface AudioFilesResponse {
  audio_files: AudioFile[];
  pagination: Pagination;
}

// Verses endpoint types
export interface Word {
  id: number;
  position: number;
  audio_url: string;
  char_type_name: string;
  line_number: number;
  page_number: number;
  code_v1: string;
  translation: {
    text: string;
    language_name: string;
  };
  transliteration: {
    text: string;
    language_name: string;
  };
}

export interface Translation {
  resource_id: number;
  text: string;
}

export interface Tafsir {
  id: number;
  language_name: string;
  name: string;
  text: string;
}

export interface Verse {
  id: number;
  verse_number: number;
  page_number: number;
  verse_key: string;
  juz_number: number;
  hizb_number: number;
  rub_el_hizb_number: number;
  sajdah_type: string | null;
  sajdah_number: number | null;
  words: Word[];
  translations: Translation[];
  tafsirs: Tafsir[];
}

export interface VersesResponse {
  verses: Verse[];
  pagination: Pagination;
}
