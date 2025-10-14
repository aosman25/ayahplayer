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
- `POST /api/token` - Get OAuth2 access token (public)

### Chapters
- `POST /api/chapters` - Get all Quran chapters (requires token)

### Reciters
- `POST /api/reciters` - Get all reciters (requires token)
- `POST /api/reciters/rub/:rub_number/recitation/:recitation_id` - Get verses by rub and recitation (requires token)

### Verses
- `POST /api/verses/rub/:rub_number` - Get verses by rub number (requires token)

## Authentication

All endpoints (except `/api/token`) require an access token in the `Authorization` header using the Bearer scheme:

```http
Authorization: Bearer your_token_here
```

### Example using curl:

```bash
# 1. Get access token
curl -X POST http://localhost:5000/api/token

# 2. Use token in subsequent requests
curl -X POST http://localhost:5000/api/chapters \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Example using JavaScript/Fetch:

```javascript
// Get token
const tokenResponse = await fetch('http://localhost:5000/api/token', {
  method: 'POST'
});
const { access_token } = await tokenResponse.json();

// Use token
const response = await fetch('http://localhost:5000/api/chapters', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${access_token}`
  }
});
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
