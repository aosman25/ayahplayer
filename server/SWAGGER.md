# Swagger API Documentation Guide

## Accessing the Documentation

Once your server is running, access the Swagger UI at:

```
http://localhost:5000/api-docs
```

## Features

### 1. Interactive API Testing
- Click on any endpoint to expand it
- Click "Try it out" button
- Fill in parameters and request body
- Click "Execute" to send the request
- View the response in real-time

### 2. Authentication Flow

To test protected endpoints:

1. **Get Access Token**:
   - Expand `POST /api/token`
   - Click "Try it out"
   - Click "Execute"
   - Copy the `access_token` from the response

2. **Authorize with Token**:
   - Click the **"Authorize"** button at the top of the page (or the lock icon 🔒)
   - In the dialog, enter: `Bearer YOUR_ACCESS_TOKEN` (or just the token, Swagger will add "Bearer" automatically)
   - Click "Authorize"
   - Click "Close"

3. **Use Protected Endpoints**:
   - All subsequent requests will now include the Authorization header automatically
   - Expand any protected endpoint (e.g., `/api/chapters`)
   - Click "Try it out"
   - Click "Execute" (no need to manually add the token!)

**Note**: The access token is now sent in the `Authorization` header using the Bearer scheme, not in the request body.

### 3. Schema Reference

All request and response schemas are documented with:
- Field names and types
- Required vs optional fields
- Example values
- Nested object structures

Navigate to the "Schemas" section at the bottom of the page to view all data models.

## API Endpoints Overview

### Authentication
- **POST /api/token** - Get OAuth2 access token (public, no authentication required)

### Chapters
- **POST /api/chapters** - Get all Quran chapters with metadata

### Reciters
- **POST /api/reciters** - Get list of all reciters with styles
- **POST /api/reciters/rub/{rub_number}/recitation/{recitation_id}** - Get audio files for specific rub and recitation

### Verses
- **POST /api/verses/rub/{rub_number}** - Get verses with translations, transliterations, and tafsirs

## Response Schemas

### Common Types

**TranslatedName**
```json
{
  "language_name": "english",
  "name": "The Opener"
}
```

**Pagination**
```json
{
  "per_page": 10,
  "current_page": 1,
  "next_page": 2,
  "total_pages": 15,
  "total_records": 148
}
```

**ErrorResponse**
```json
{
  "error": "Error message description"
}
```

## Customization

The Swagger configuration is located in [swagger.ts](./swagger.ts). You can customize:

- API title and description
- Server URLs
- Security schemes
- Response schemas
- Tags and grouping

## OpenAPI JSON

Access the raw OpenAPI specification at:
```
http://localhost:5000/api-docs.json
```

This can be imported into tools like:
- Postman
- Insomnia
- API testing frameworks
- Code generators

## Tips

1. **Use the "Authorize" button** (if implemented) for easier token management
2. **Check response examples** to understand the data structure
3. **View the schema** for detailed field descriptions
4. **Copy curl commands** from the documentation for CLI testing
5. **Export the OpenAPI spec** to share with frontend developers

## Adding New Endpoints

When adding new endpoints, add JSDoc comments to route files:

```typescript
/**
 * @openapi
 * /api/your-endpoint:
 *   post:
 *     tags:
 *       - YourTag
 *     summary: Short description
 *     description: Detailed description
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/YourSchema'
 *     responses:
 *       200:
 *         description: Success response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/YourResponseSchema'
 */
router.post("/your-endpoint", yourController);
```

The documentation will automatically update on server restart!
