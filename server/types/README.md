# API Response Types

This directory contains TypeScript type definitions for all API responses.

## Files

- **index.ts** - Core types (AuthRequest, ErrorResponse, TokenResponse) and re-exports all response types
- **responses.ts** - Detailed response types for all API endpoints

## Response Type Definitions

### Chapters API (`/api/chapters`)

```typescript
interface ChaptersResponse {
  chapters: Chapter[];
}

interface Chapter {
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
```

### Reciters API (`/api/reciters`)

```typescript
interface RecitersResponse {
  recitations: Recitation[];
}

interface Recitation {
  id: number;
  reciter_name: string;
  style: string;
  translated_name: TranslatedName;
}
```

### Audio Files API (`/api/reciters/rub/:rub_number/recitation/:recitation_id`)

```typescript
interface AudioFilesResponse {
  audio_files: AudioFile[];
  pagination: Pagination;
}

interface AudioFile {
  verse_key: string;
  url: string;
}
```

### Verses API (`/api/verses/rub/:rub_number`)

```typescript
interface VersesResponse {
  verses: Verse[];
  pagination: Pagination;
}

interface Verse {
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
```

## Common Types

### TranslatedName
```typescript
interface TranslatedName {
  language_name: string;
  name: string;
}
```

### Pagination
```typescript
interface Pagination {
  per_page: number;
  current_page: number;
  next_page: number | null;
  total_pages: number;
  total_records: number;
}
```

## Usage

Import types from the main types directory:

```typescript
import { ChaptersResponse, VersesResponse, ErrorResponse } from "../types";
```

Or import directly from responses:

```typescript
import { ChaptersResponse, VersesResponse } from "../types/responses";
```

## Benefits

- **Type Safety**: Catch errors at compile time
- **IntelliSense**: Get autocomplete in your IDE
- **Documentation**: Types serve as inline documentation
- **Refactoring**: Easy to update when API changes
- **Validation**: Ensure responses match expected structure
