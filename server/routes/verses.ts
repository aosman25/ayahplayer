import express from "express";
import { getVersesByRub } from "../controllers/versesController";
import { requireAccessToken } from "../middleware/auth";

const router = express.Router();

/**
 * @openapi
 * /api/verses/rub/{rub_number}:
 *   post:
 *     tags:
 *       - Verses
 *     summary: Get verses by rub number
 *     description: Retrieve all verses (Ayahs) in a specific rub with translations, transliterations, and tafsirs
 *     parameters:
 *       - in: path
 *         name: rub_number
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 240
 *         description: Rub number (1-240). The Quran is divided into 240 rubs.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - access_token
 *             properties:
 *               access_token:
 *                 type: string
 *                 description: OAuth2 access token from /api/token
 *     responses:
 *       200:
 *         description: Successfully retrieved verses
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VersesResponse'
 *       400:
 *         description: Invalid rub number
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Access token is required
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
router.post("/rub/:rub_number", requireAccessToken, getVersesByRub);

export default router;
