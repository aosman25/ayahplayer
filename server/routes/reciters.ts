import express from "express";
import { getAllReciters, getVersesByRubAndRecitation } from "../controllers/recitersController";
import { requireAccessToken } from "../middleware/auth";

const router = express.Router();

/**
 * @openapi
 * /api/reciters:
 *   post:
 *     tags:
 *       - Reciters
 *     summary: Get all Quran reciters
 *     description: Retrieve a list of all available Quran reciters and their recitation styles
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
 *                 description: OAuth2 access token
 *               language:
 *                 type: string
 *                 default: en
 *                 description: Language code for translated names
 *     responses:
 *       200:
 *         description: Successfully retrieved reciters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RecitersResponse'
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
router.post("/", requireAccessToken, getAllReciters);

/**
 * @openapi
 * /api/reciters/rub/{rub_number}/recitation/{recitation_id}:
 *   post:
 *     tags:
 *       - Reciters
 *     summary: Get audio files for verses by rub and recitation
 *     description: Retrieve audio file URLs for verses in a specific rub with a specific recitation
 *     parameters:
 *       - in: path
 *         name: rub_number
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 240
 *         description: Rub number (1-240)
 *       - in: path
 *         name: recitation_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Recitation ID from /api/reciters
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
 *                 description: OAuth2 access token
 *     responses:
 *       200:
 *         description: Successfully retrieved audio files
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AudioFilesResponse'
 *       400:
 *         description: Invalid parameters
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
router.post("/rub/:rub_number/recitation/:recitation_id", requireAccessToken, getVersesByRubAndRecitation);

export default router;
