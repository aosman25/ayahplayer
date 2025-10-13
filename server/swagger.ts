import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "QuranHifz API",
      version: "1.0.0",
      description: "RESTful API for QuranHifz application - Access Quran chapters, verses, reciters, and audio recitations",
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
        Word: {
          type: "object",
          properties: {
            id: {
              type: "number",
              example: 1,
            },
            position: {
              type: "number",
              example: 1,
            },
            audio_url: {
              type: "string",
              example: "wbw/001_001_001.mp3",
            },
            char_type_name: {
              type: "string",
              example: "word",
            },
            line_number: {
              type: "number",
              example: 2,
            },
            page_number: {
              type: "number",
              example: 1,
            },
            code_v1: {
              type: "string",
              example: "&#xfb51;",
            },
            translation: {
              type: "object",
              properties: {
                text: {
                  type: "string",
                  example: "In (the) name",
                },
                language_name: {
                  type: "string",
                  example: "english",
                },
              },
            },
            transliteration: {
              type: "object",
              properties: {
                text: {
                  type: "string",
                  example: "bis'mi",
                },
                language_name: {
                  type: "string",
                  example: "english",
                },
              },
            },
          },
        },
        Translation: {
          type: "object",
          properties: {
            resource_id: {
              type: "number",
              example: 131,
            },
            text: {
              type: "string",
              example: "In the Name of Allah—the Most Compassionate, Most Merciful.",
            },
          },
        },
        Tafsir: {
          type: "object",
          properties: {
            id: {
              type: "number",
              example: 82641,
            },
            language_name: {
              type: "string",
              example: "english",
            },
            name: {
              type: "string",
              example: "Tafsir Ibn Kathir",
            },
            text: {
              type: "string",
              example: "<h2 class=\"title\">Which was revealed in Makkah</h2>",
            },
          },
        },
        Verse: {
          type: "object",
          properties: {
            id: {
              type: "number",
              example: 1,
            },
            verse_number: {
              type: "number",
              example: 1,
            },
            page_number: {
              type: "number",
              example: 1,
            },
            verse_key: {
              type: "string",
              example: "1:1",
            },
            juz_number: {
              type: "number",
              example: 1,
            },
            hizb_number: {
              type: "number",
              example: 1,
            },
            rub_el_hizb_number: {
              type: "number",
              example: 1,
            },
            sajdah_type: {
              type: "string",
              nullable: true,
              example: null,
            },
            sajdah_number: {
              type: "number",
              nullable: true,
              example: null,
            },
            words: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Word",
              },
            },
            translations: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Translation",
              },
            },
            tafsirs: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Tafsir",
              },
            },
          },
        },
        VersesResponse: {
          type: "object",
          properties: {
            verses: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Verse",
              },
            },
            pagination: {
              $ref: "#/components/schemas/Pagination",
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
        description: "Quran verses (Ayahs)",
      },
    ],
  },
  apis: ["./routes/*.ts"], // Path to the API routes
};

export const swaggerSpec = swaggerJsdoc(options);
