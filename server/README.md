# QuranHifz Backend API

A TypeScript-based Express server for the QuranHifz application, built with MVC architecture.

## Features

- **TypeScript**: Full type safety and better developer experience
- **MVC Architecture**: Organized code with controllers, routes, and middleware
- **OAuth2 Authentication**: Secure token-based authentication
- **RESTful API**: Clean and consistent API endpoints
- **Swagger Documentation**: Interactive API documentation with Swagger UI
- **Error Handling**: Proper error handling with appropriate status codes

## Project Structure

```
server/
├── controllers/          # Business logic
│   ├── authController.ts
│   ├── chaptersController.ts
│   ├── recitersController.ts
│   └── versesController.ts
├── routes/              # Route definitions
│   ├── auth.ts
│   ├── chapters.ts
│   ├── reciters.ts
│   └── verses.ts
├── middleware/          # Custom middleware
│   └── auth.ts
├── types/              # TypeScript type definitions
│   ├── index.ts
│   ├── responses.ts
│   └── README.md
├── dist/               # Compiled JavaScript (generated)
├── server.ts           # Main server file
├── swagger.ts          # Swagger/OpenAPI configuration
├── tsconfig.json       # TypeScript configuration
└── package.json
```

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the server directory:

```env
CLIENT_ID=your_client_id
CLIENT_SECRET=your_client_secret
AUTH_URL=https://auth.example.com
BASE_URL=https://api.example.com
PORT=5000
```

## Scripts

- **Development** (with hot reload):
  ```bash
  npm run dev
  ```

- **Build** (compile TypeScript):
  ```bash
  npm run build
  ```

- **Production**:
  ```bash
  npm start
  ```

## API Documentation

Once the server is running, you can access the interactive API documentation:

- **Swagger UI**: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)
- **OpenAPI JSON**: [http://localhost:5000/api-docs.json](http://localhost:5000/api-docs.json)

The Swagger UI provides:
- Interactive API testing
- Complete request/response schemas
- Authentication flow examples
- Try-it-out functionality for all endpoints

## API Endpoints

### Authentication
- `GET /api/token` - Get OAuth2 access token (public)

### Chapters
- `GET /api/chapters` - Get all Quran chapters (requires token)

### Reciters
- `GET /api/reciters?language=en` - Get all reciters (requires token)
  - Query Parameters:
    - `language` (optional): Language code for translated names (default: "en")
- `GET /api/reciters/recitations/:recitation_id/by_juz/:juz_number` - Get audio files for verses by juz and recitation (requires token)
  - Parameters: `juz_number` (1-30), `recitation_id`
- `GET /api/reciters/recitations/:recitation_id/by_hizb/:hizb_number` - Get audio files for verses by hizb and recitation (requires token)
  - Parameters: `hizb_number` (1-60), `recitation_id`
- `GET /api/reciters/recitations/:recitation_id/by_rub/:rub_number` - Get audio files for verses by rub and recitation (requires token)
  - Parameters: `rub_number` (1-240), `recitation_id`

### Verses
- `GET /api/verses/rub/:rub_number` - Get verses by rub number (requires token)

## Authentication

All endpoints (except `/api/token`) require an access token in the `Authorization` header using the Bearer scheme:

```http
Authorization: Bearer your_token_here
```

### Example using curl:

```bash
# 1. Get access token
curl -X GET http://localhost:5000/api/token

# 2. Use token in subsequent requests
curl -X GET http://localhost:5000/api/chapters \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# 3. Get reciters with language parameter
curl -X GET "http://localhost:5000/api/reciters?language=ar" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# 4. Get verses by rub number
curl -X GET http://localhost:5000/api/verses/rub/1 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# 5. Get audio files by juz and recitation
curl -X GET http://localhost:5000/api/reciters/recitations/7/by_juz/1 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# 6. Get audio files by hizb and recitation
curl -X GET http://localhost:5000/api/reciters/recitations/7/by_hizb/1 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# 7. Get audio files by rub and recitation
curl -X GET http://localhost:5000/api/reciters/recitations/7/by_rub/1 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Example using JavaScript/Fetch:

```javascript
// 1. Get token
const tokenResponse = await fetch('http://localhost:5000/api/token', {
  method: 'GET'
});
const { access_token } = await tokenResponse.json();

// 2. Get chapters
const chaptersResponse = await fetch('http://localhost:5000/api/chapters', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${access_token}`
  }
});
const chapters = await chaptersResponse.json();

// 3. Get reciters with language parameter
const recitersResponse = await fetch('http://localhost:5000/api/reciters?language=ar', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${access_token}`
  }
});
const reciters = await recitersResponse.json();

// 4. Get verses by rub number
const versesResponse = await fetch('http://localhost:5000/api/verses/rub/1', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${access_token}`
  }
});
const verses = await versesResponse.json();

// 5. Get audio files by juz and recitation
const juzAudioResponse = await fetch('http://localhost:5000/api/reciters/recitations/7/by_juz/1', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${access_token}`
  }
});
const juzAudioFiles = await juzAudioResponse.json();

// 6. Get audio files by hizb and recitation
const hizbAudioResponse = await fetch('http://localhost:5000/api/reciters/recitations/7/by_hizb/1', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${access_token}`
  }
});
const hizbAudioFiles = await hizbAudioResponse.json();

// 7. Get audio files by rub and recitation
const rubAudioResponse = await fetch('http://localhost:5000/api/reciters/recitations/7/by_rub/1', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${access_token}`
  }
});
const rubAudioFiles = await rubAudioResponse.json();
```

## Type Safety

The project uses TypeScript for full type safety. Key types include:

- `AuthRequest` - Extended Express Request with access token
- `TokenResponse` - OAuth2 token response
- `ErrorResponse` - Standardized error responses
- `EnvConfig` - Environment variable types

## Development

The project uses:
- **TypeScript** for type safety
- **Express** for the web framework
- **Axios** for HTTP requests
- **CORS** for cross-origin resource sharing
- **dotenv** for environment configuration
- **Swagger** for API documentation
- **swagger-jsdoc** & **swagger-ui-express** for OpenAPI generation

## License

ISC
