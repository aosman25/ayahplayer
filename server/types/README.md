# API Response Types

This directory contains TypeScript type definitions for all API responses.

## Files

- **index.ts** - Core types (AuthRequest, ErrorResponse, TokenResponse) and re-exports all response types
- **responses.ts** - Detailed response types for all API endpoints

## Response Type Definitions

### Authentication API (`GET /api/token`)

```typescript
interface TokenResponse {
  access_token: string;
}
```

### Chapters API (`GET /api/chapters`)

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

### Reciters API (`GET /api/reciters`)

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

### Audio Recitations API

Available endpoints:
- `GET /api/reciters/recitations/:recitation_id/by_juz/:juz_number`
- `GET /api/reciters/recitations/:recitation_id/by_hizb/:hizb_number`
- `GET /api/reciters/recitations/:recitation_id/by_rub/:rub_number`

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

### Verses API (`GET /api/verses/uthmani`)

Returns Uthmani script of Quran verses with optional filtering via query parameters:
- `chapter_number` (1-114): Filter by chapter/surah
- `juz_number` (1-30): Filter by juz
- `page_number` (1-604): Filter by Madani Mushaf page
- `hizb_number` (1-60): Filter by hizb
- `rub_el_hizb_number` (1-240): Filter by Rub el Hizb
- `verse_key` (e.g., "1:1"): Filter by specific verse

```typescript
interface VersesResponse {
  verses: UthmaniVerse[];
}

interface UthmaniVerse {
  id: number;
  verse_key: string;
  text_uthmani: string;
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
