import express from "express";
import { getAllReciters, getVersesByRubAndRecitation, getVersesByJuzAndRecitation, getVersesByHizbAndRecitation } from "../controllers/recitersController";
import { requireAccessToken } from "../middleware/auth";

const router = express.Router();

/**
 * @openapi
 * /api/reciters:
 *   get:
 *     tags:
 *       - Reciters
 *     summary: Get all Quran reciters
 *     description: Retrieve a list of all available Quran reciters and their recitation styles
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: language
 *         required: false
 *         schema:
 *           type: string
 *           default: en
 *         description: Language code for translated names
 *     responses:
 *       200:
 *         description: Successfully retrieved reciters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RecitersResponse'
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
router.get("/", requireAccessToken, getAllReciters);

/**
 * @openapi
 * /api/reciters/recitations/{recitation_id}/by_juz/{juz_number}:
 *   get:
 *     tags:
 *       - Reciters
 *     summary: Get audio files for verses by juz and recitation
 *     description: Retrieve audio file URLs for verses in a specific juz with a specific recitation
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: juz_number
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 30
 *         description: Juz number (1-30)
 *       - in: path
 *         name: recitation_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Recitation ID from /api/reciters
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
router.get("/recitations/:recitation_id/by_juz/:juz_number", requireAccessToken, getVersesByJuzAndRecitation);

/**
 * @openapi
 * /api/reciters/recitations/{recitation_id}/by_hizb/{hizb_number}:
 *   get:
 *     tags:
 *       - Reciters
 *     summary: Get audio files for verses by hizb and recitation
 *     description: Retrieve audio file URLs for verses in a specific hizb with a specific recitation
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: hizb_number
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 60
 *         description: Hizb number (1-60)
 *       - in: path
 *         name: recitation_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Recitation ID from /api/reciters
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
router.get("/recitations/:recitation_id/by_hizb/:hizb_number", requireAccessToken, getVersesByHizbAndRecitation);

/**
 * @openapi
 * /api/reciters/rub/{rub_number}/recitation/{recitation_id}:
 *   get:
 *     tags:
 *       - Reciters
 *     summary: Get audio files for verses by rub and recitation
 *     description: Retrieve audio file URLs for verses in a specific rub with a specific recitation
 *     security:
 *       - bearerAuth: []
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
router.get("/rub/:rub_number/recitation/:recitation_id", requireAccessToken, getVersesByRubAndRecitation);

export default router;
