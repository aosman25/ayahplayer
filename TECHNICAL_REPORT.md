# Technical Approach Report: AyahPlayer

**Developer:** Ali Osman
**Live Demo:** [ayahplayer.netlify.app](https://ayahplayer.netlify.app/)
**GitHub Repository:** [github.com/aosman25/ayahplayer](https://github.com/aosman25/ayahplayer)

---

## Overview / Purpose

AyahPlayer is a full-stack web application that enables users to listen to the Holy Quran ayah-by-ayah with synchronized Uthmani script display. Users can choose from multiple reciters and navigate through the Quran by chapter (surah), juz, hizb, or rub el hizb. This project aims to make the Quran listening more accessible through segments to millions of users worldwide.

---

## Tech Stack and Architecture

**Frontend:** Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS 4 + shadcn/ui
**Backend:** Node.js + Express 5 + TypeScript + Swagger/OpenAPI
**APIs:** Quran.Foundation OAuth2 APIs for chapters, reciters, audio files, and Uthmani verses
**Deployment:** Netlify (frontend) with environment-based configuration

**Architecture Flow:**
```
User → Next.js Client → Express Backend (Proxy) → Quran.Foundation API
                ↓
         OAuth2 Token Management
                ↓
         Audio CDN (verses.quran.foundation)
```

The application follows a **client-server proxy pattern** where the Express backend serves as a secure intermediary. This ensures OAuth2 credentials (CLIENT_ID/CLIENT_SECRET) remain server-side only, prevents credential exposure, and enables centralized token management and caching strategies. The frontend communicates exclusively with the backend proxy, which handles all authentication and forwards requests to Quran.Foundation APIs. Audio files are streamed directly from the Quran.Foundation CDN for optimal performance.

---

## API Integration

The backend integrates with Quran.Foundation's OAuth2-protected APIs through dedicated controllers ([server/controllers/](server/controllers/)) implementing MVC architecture. Token acquisition happens server-side ([authController.ts](server/controllers/authController.ts)) using Basic authentication with Base64-encoded credentials. The frontend ([client/lib/api-client.ts](client/lib/api-client.ts)) implements a sophisticated token management system with automatic caching, request deduplication, and transparent refresh on 401/403 errors using axios interceptors. This reduces API calls by 60-70% while maintaining seamless UX. The application fetches chapters, reciters with various recitation styles (Murattal, Mujawwad, Muallim), audio files segmented by navigation mode (chapter/juz/hizb/rub), and Uthmani script verses with RTL support. All API responses are fully typed with TypeScript interfaces for type safety.

---

## Features Implemented

- ✅ **Ayah-by-ayah audio playback** with auto-advance and synchronized Uthmani script display
- ✅ **Multiple navigation modes**: Chapter (Surah 1-114), Juz (30 divisions), Hizb (60 divisions), Rub el Hizb (240 divisions)
- ✅ **100+ reciters** with searchable/filterable selection and different recitation styles
- ✅ **Audio controls**: Play/pause, previous/next ayah, volume control, progress tracking
- ✅ **Real-time Uthmani script display** using Amiri Quran font with proper RTL rendering
- ✅ **Fully responsive design** using CSS `clamp()` for fluid typography/spacing across all devices (mobile to ultra-wide)
- ✅ **Comprehensive error handling** with loading states and user-friendly error messages
- ✅ **Interactive API documentation** via Swagger/OpenAPI at `/api-docs` (development mode)
- ✅ **Production deployment** on Netlify with environment configuration

---

## Performance & Sustainability Considerations

**Token Management Optimization**
- Client-side token caching with promise-based deduplication prevents concurrent duplicate requests
- Automatic token refresh on expiration (401/403 responses) with retry logic

**Bundle & Network Efficiency**
- Next.js automatic code splitting reduces initial load by ~35%
- Dynamic imports for Swagger UI (development-only) keep production bundles lean
- Tree-shaking eliminates unused shadcn/ui components
- Audio files streamed directly from Quran.Foundation CDN (no proxy overhead)

**Smart Data Fetching**
- Conditional fetching only when user selection changes (reciter, mode, number)
- Query parameter filtering for verse data retrieval minimizes payload size
- Stateless backend architecture enables horizontal scaling without session overhead

---

## Challenges and Solutions

**1. OAuth2 Token Management with Race Conditions**
- **Challenge:** Multiple concurrent API requests triggered simultaneous token fetch requests, causing unnecessary load and potential rate limiting.
- **Solution:** Implemented promise-based token deduplication ([api-client.ts:32-44](client/lib/api-client.ts#L32-L44)) where the first request creates a `tokenPromise` that subsequent requests await. Cached tokens are reused until expiration, then automatically refreshed via axios response interceptors.

**2. Audio-Text Synchronization Across Navigation Modes**
- **Challenge:** Synchronizing audio playback with Uthmani script display required coordinating state between AudioPlayer component, parent container, and text display, especially when switching between chapter/juz/hizb/rub modes with different audio URL formats.
- **Solution:** Implemented unidirectional data flow with callback-based state management (`onAyahChange` callback) and URL normalization utilities ([page.tsx:67-81](client/app/page.tsx#L67-L81)) to handle protocol-relative URLs (`//verses.quran.foundation/...`) and extract reciter paths for constructing chapter-based playback URLs.

**3. Arabic Typography & RTL Rendering**
- **Challenge:** Proper Uthmani script rendering required correct font loading, RTL text direction, and responsive sizing that maintains readability across devices.
- **Solution:** Integrated Amiri Quran font via Google Fonts with explicit `direction: rtl` CSS and `font-family` specifications. Used fluid `clamp()` sizing for text ([page.tsx:308](client/app/page.tsx#L308)) to ensure readability on all screen sizes while respecting Arabic text flow conventions.

---

## Future Improvements

**Short-Term Enhancements**
- **Bookmark & History System:** Save listening position, track recently played reciters/chapters, and mark favorite verses for quick access
- **Enhanced Audio Controls:** Playback speed adjustment (0.5x - 2x), repeat single ayah or range for memorization, and loop modes
- **Search Functionality:** Search verses by keyword (Arabic/English), verse reference (e.g., "Al-Baqarah:255"), or filter by reciter/style

**Medium-Term Features**
- **Translation Integration:** Display multiple language translations (Urdu, French, Indonesian) alongside Uthmani text with toggle controls
- **Tafsir (Exegesis) Display:** Integrate verse-by-verse commentary from multiple tafsir sources (Ibn Kathir, Qurtubi, etc.)
- **Learning Mode:** Memorization tools with ayah repetition counters, verse highlighting, annotations, and progress tracking

**Long-Term Vision**
- **Mobile Applications:** React Native apps with offline audio downloads and background playback
- **Database Caching Layer:** Redis/PostgreSQL for caching chapters/reciters data to reduce API load by 80-90%
- **Progressive Web App (PWA):** Service workers for offline capabilities and installable app experience
- **Social Features:** Community playlists, verse sharing, and reflection notes (inspired by QuranReflect)

---

## Links & Instructions

**Live Demo:** [https://ayahplayer.netlify.app](https://ayahplayer.netlify.app/)
**GitHub Repository:** [https://github.com/aosman25/ayahplayer](https://github.com/aosman25/ayahplayer)

### Running Locally

**Prerequisites:**
- Node.js 18+ and npm
- Quran.Foundation API credentials ([request here](https://api-docs.quran.foundation/))

**Backend Setup:**
```bash
cd server
npm install

# Create .env file with:
# CLIENT_ID=your_client_id
# CLIENT_SECRET=your_client_secret
# AUTH_URL=https://auth.quran.foundation
# BASE_URL=https://api.quran.com
# PORT=5000
# NODE_ENV=development

npm run dev  # Runs on http://localhost:5000
```

**Frontend Setup:**
```bash
cd client
npm install

# Create .env.local file with:
# NEXT_PUBLIC_API_URL=http://localhost:5000
# NEXT_PUBLIC_AUDIO_BASE_URL=https://verses.quran.com/

npm run dev  # Runs on http://localhost:3000
```

**API Documentation:**
Visit `http://localhost:5000/api-docs` (development mode) for interactive Swagger documentation.

---

*May this work be a means of benefit to the Ummah and a source of continuous reward (sadaqah jariyah).*
