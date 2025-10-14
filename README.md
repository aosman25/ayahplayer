# 📖 AyahPlayer

**🎧 Listen to the Holy Quran Ayah By Ayah**

AyahPlayer is a modern web application that allows users to listen to the Holy Quran with beautiful Uthmani script display. Choose from various reciters and navigate through the Quran by chapter, juz, hizb, or rub el hizb.

## 🌟 Demo

**🔗 [Live Demo](https://ayahplayer.netlify.app/)**

Try out AyahPlayer now at [ayahplayer.netlify.app](https://ayahplayer.netlify.app/) - no installation required!

## ✨ Features

- 🎙️ **Multiple Reciters**: Choose from a wide selection of renowned Quran reciters
- 🧭 **Flexible Navigation**: Browse by chapter, juz, hizb, or rub el hizb
- ✍️ **Uthmani Script**: Beautiful display of Quranic text in traditional Uthmani script
- 📱 **Responsive Design**: Fully responsive interface that works on all devices
- 🔊 **Audio Playback**: High-quality audio playback with playback controls
- ▶️ **Auto-play**: Automatically progresses through ayahs

## 📁 Project Structure

```
quranhifz/
├── client/              # Next.js frontend application
│   ├── app/            # Next.js app directory
│   ├── components/     # React components
│   ├── lib/           # Utility functions and API client
│   └── public/        # Static assets
├── server/             # Express backend API
│   ├── controllers/   # Business logic
│   ├── routes/        # API route definitions
│   ├── middleware/    # Custom middleware (auth)
│   └── types/         # TypeScript type definitions
└── README.md          # This file
```

## 🛠️ Technology Stack

### Frontend (Client)
- ⚛️ **Next.js 15.2.4** - React framework with App Router
- ⚛️ **React 19** - UI library
- 📘 **TypeScript** - Type safety
- 🎨 **Tailwind CSS 4** - Utility-first CSS framework
- 🧩 **shadcn/ui** - Component library
- 🌐 **Axios** - HTTP client

### Backend (Server)
- 🟢 **Node.js** - Runtime environment
- 🚀 **Express 5** - Web framework
- 📘 **TypeScript** - Type safety
- 📚 **Swagger/OpenAPI** - API documentation
- 🔐 **OAuth2** - Authentication

## 🚀 Getting Started

### Prerequisites

- 🟢 Node.js 18+ and npm
- 📦 Git

### Installation

1. **📥 Clone the repository**
   ```bash
   git clone https://github.com/aosman25/ayahplayer.git
   cd quranhifz
   ```

2. **📦 Install dependencies**

   For the client:
   ```bash
   cd client
   npm install
   ```

   For the server:
   ```bash
   cd server
   npm install
   ```

### ⚙️ Configuration

#### Client Environment Variables

Create a `.env.local` file in the `client` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_AUDIO_BASE_URL=https://verses.quran.com/
```

#### Server Environment Variables

Create a `.env` file in the `server` directory:

```env
CLIENT_ID=your_client_id
CLIENT_SECRET=your_client_secret
AUTH_URL=https://auth.quran.foundation
BASE_URL=https://api.quran.com
PORT=5000
NODE_ENV=development
```

> **🔑 Important**: You need to obtain `CLIENT_ID` and `CLIENT_SECRET` from the [Quran Foundation](https://api-docs.quran.foundation/) to use their API. Visit their website to request API credentials.

### ▶️ Running the Application

#### Development Mode

1. **🔧 Start the backend server**
   ```bash
   cd server
   npm run dev
   ```
   The server will start on `http://localhost:5000`

2. **🎨 Start the frontend application**
   ```bash
   cd client
   npm run dev
   ```
   The client will start on `http://localhost:3000`

3. **🌐 Access the application**
   - Frontend: http://localhost:3000
   - API Documentation: http://localhost:5000/api-docs

#### Production Mode

1. **🏗️ Build the applications**
   ```bash
   # Build client
   cd client
   npm run build

   # Build server
   cd server
   npm run build
   ```

2. **🚀 Start in production**
   ```bash
   # Start server
   cd server
   npm start

   # Start client
   cd client
   npm start
   ```

## 📚 API Documentation

The backend API provides comprehensive Swagger/OpenAPI documentation. When running in development mode, access the interactive API documentation at:

**🔗 http://localhost:5000/api-docs**

### Main API Endpoints

- 🔓 `GET /api/token` - Get OAuth2 access token
- 📖 `GET /api/chapters` - Get all Quran chapters
- 🎙️ `GET /api/reciters` - Get all reciters
- 🎵 `GET /api/reciters/recitations/:recitation_id/by_juz/:juz_number` - Get audio files by juz
- 🎵 `GET /api/reciters/recitations/:recitation_id/by_hizb/:hizb_number` - Get audio files by hizb
- 🎵 `GET /api/reciters/recitations/:recitation_id/by_rub/:rub_number` - Get audio files by rub
- ✍️ `GET /api/verses/uthmani` - Get Uthmani script of ayahs

All endpoints except `/api/token` require authentication via Bearer token.

## 🎯 Features in Detail

### 🔊 Audio Playback
- ▶️ Play/pause controls
- ⏮️⏭️ Previous/next ayah navigation
- 🔉 Volume control
- 🔁 Auto-replay option
- 📊 Progress tracking

### 🎙️ Recitation Selection
- 📋 Browse reciters by name
- 🎨 Filter by recitation style
- 📍 Select segment type (juz, hizb, rub el hizb)
- 🔢 Choose specific segment number

### ✍️ Uthmani Script Display
- 📜 Traditional Uthmani script
- 🔍 Auto-scrolling to current ayah
- 📏 Large, readable font
- 📐 Responsive sizing

## 💻 Development

### Client Development

The client uses Next.js 15 with the App Router. Key directories:

- 📄 `app/` - Pages and layouts
- 🧩 `components/` - Reusable React components
- 🔧 `lib/` - API client and utilities

### Server Development

The server follows MVC architecture:

- 🎮 `controllers/` - Business logic
- 🛣️ `routes/` - Route definitions with Swagger docs
- 🔒 `middleware/` - Authentication middleware
- 📘 `types/` - TypeScript interfaces

### Code Style

Both client and server use TypeScript with strict mode enabled for type safety.

## 🤝 Contributing

1. 🍴 Fork the repository
2. 🌿 Create a feature branch (`git checkout -b feature/amazing-feature`)
3. 💾 Commit your changes (`git commit -m 'Add amazing feature'`)
4. 📤 Push to the branch (`git push origin feature/amazing-feature`)
5. 🔀 Open a Pull Request

## 📄 License

ISC

## 🙏 Acknowledgments

- 📖 Quran audio and data provided by [Quran Foundation](https://quran.foundation/)
- ✍️ Uthmani script font: Amiri Quran
- 🧩 UI components from [shadcn/ui](https://ui.shadcn.com)
- 🔐 API credentials from [Quran Foundation](https://api-docs.quran.foundation/)

---

**💚 Made with dedication to facilitate the listening and learning of the Holy Quran**
