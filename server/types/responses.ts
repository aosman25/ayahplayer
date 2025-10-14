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

// Verses endpoint types (Uthmani script)
export interface UthmaniVerse {
  id: number;
  verse_key: string;
  text_uthmani: string;
}

export interface VersesResponse {
  verses: UthmaniVerse[];
}
