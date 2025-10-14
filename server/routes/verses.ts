import express from "express";
import { getUthmaniVerses } from "../controllers/versesController";
import { requireAccessToken } from "../middleware/auth";

const router = express.Router();

/**
 * @openapi
 * /api/verses/uthmani:
 *   get:
 *     tags:
 *       - Verses
 *     summary: Get Uthmani script of ayahs
 *     description: Retrieve Uthmani script of Quran ayahs with optional filtering. Leave all query parameters blank to fetch the entire Quran.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: chapter_number
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 114
 *         description: Filter by specific chapter/surah (1-114)
 *       - in: query
 *         name: juz_number
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 30
 *         description: Filter by specific juz (1-30)
 *       - in: query
 *         name: page_number
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 604
 *         description: Filter by Madani Mushaf page number (1-604)
 *       - in: query
 *         name: hizb_number
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 60
 *         description: Filter by specific hizb (1-60)
 *       - in: query
 *         name: rub_el_hizb_number
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 240
 *         description: Filter by specific Rub el Hizb (1-240)
 *       - in: query
 *         name: verse_key
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter by specific ayah (e.g., "1:1" for Al-Fatihah, ayah 1)
 *     responses:
 *       200:
 *         description: Successfully retrieved Uthmani script ayahs
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VersesResponse'
 *       400:
 *         description: Invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Authorization header is missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/uthmani", requireAccessToken, getUthmaniVerses);

export default router;
