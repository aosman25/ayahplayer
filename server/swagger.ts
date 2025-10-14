import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "AyahPlayer API",
      version: "1.0.0",
      description: "RESTful API for AyahPlayer application - Listen to the Holy Quran Ayah By Ayah. Access Quran chapters, ayahs, reciters, and audio recitations",
      contact: {
        name: "API Support",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Access token obtained from /api/token endpoint",
        },
      },
      schemas: {
        ErrorResponse: {
          type: "object",
          properties: {
            error: {
              type: "string",
              description: "Error message",
            },
          },
        },
        TokenResponse: {
          type: "object",
          properties: {
            access_token: {
              type: "string",
              description: "OAuth2 access token",
            },
          },
        },
        TranslatedName: {
          type: "object",
          properties: {
            language_name: {
              type: "string",
              example: "english",
            },
            name: {
              type: "string",
              example: "The Opener",
            },
          },
        },
        Pagination: {
          type: "object",
          properties: {
            per_page: {
              type: "number",
              example: 10,
            },
            current_page: {
              type: "number",
              example: 1,
            },
            next_page: {
              type: "number",
              nullable: true,
              example: 2,
            },
            total_pages: {
              type: "number",
              example: 15,
            },
            total_records: {
              type: "number",
              example: 148,
            },
          },
        },
        Chapter: {
          type: "object",
          properties: {
            id: {
              type: "number",
              example: 1,
            },
            revelation_place: {
              type: "string",
              example: "makkah",
            },
            revelation_order: {
              type: "number",
              example: 5,
            },
            bismillah_pre: {
              type: "boolean",
              example: false,
            },
            name_simple: {
              type: "string",
              example: "Al-Fatihah",
            },
            name_complex: {
              type: "string",
              example: "Al-Fātiĥah",
            },
            name_arabic: {
              type: "string",
              example: "الفاتحة",
            },
            verses_count: {
              type: "number",
              example: 7,
            },
            pages: {
              type: "array",
              items: {
                type: "number",
              },
              example: [1, 1],
            },
            translated_name: {
              $ref: "#/components/schemas/TranslatedName",
            },
          },
        },
        ChaptersResponse: {
          type: "object",
          properties: {
            chapters: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Chapter",
              },
            },
          },
        },
        Recitation: {
          type: "object",
          properties: {
            id: {
              type: "number",
              example: 1,
            },
            reciter_name: {
              type: "string",
              example: "AbdulBaset AbdulSamad",
            },
            style: {
              type: "string",
              example: "Mujawwad",
            },
            translated_name: {
              $ref: "#/components/schemas/TranslatedName",
            },
          },
        },
        RecitersResponse: {
          type: "object",
          properties: {
            recitations: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Recitation",
              },
            },
          },
        },
        AudioFile: {
          type: "object",
          properties: {
            verse_key: {
              type: "string",
              example: "1:1",
            },
            url: {
              type: "string",
              example: "AbdulBaset/Mujawwad/mp3/001001.mp3",
            },
          },
        },
        AudioFilesResponse: {
          type: "object",
          properties: {
            audio_files: {
              type: "array",
              items: {
                $ref: "#/components/schemas/AudioFile",
              },
            },
            pagination: {
              $ref: "#/components/schemas/Pagination",
            },
          },
        },
        UthmaniVerse: {
          type: "object",
          properties: {
            id: {
              type: "number",
              example: 1,
            },
            verse_key: {
              type: "string",
              example: "1:1",
            },
            text_uthmani: {
              type: "string",
              example: "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ",
            },
          },
        },
        VersesResponse: {
          type: "object",
          properties: {
            verses: {
              type: "array",
              items: {
                $ref: "#/components/schemas/UthmaniVerse",
              },
            },
          },
        },
      },
    },
    tags: [
      {
        name: "Authentication",
        description: "OAuth2 token management",
      },
      {
        name: "Chapters",
        description: "Quran chapters (Surahs)",
      },
      {
        name: "Reciters",
        description: "Quran reciters and recitations",
      },
      {
        name: "Verses",
        description: "Quran ayahs",
      },
    ],
  },
  apis: ["./routes/*.ts"], // Path to the API routes
};

export const swaggerSpec = swaggerJsdoc(options);
