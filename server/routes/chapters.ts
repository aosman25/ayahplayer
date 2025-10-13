import express from "express";
import { getAllChapters } from "../controllers/chaptersController";
import { requireAccessToken } from "../middleware/auth";

const router = express.Router();

/**
 * @openapi
 * /api/chapters:
 *   post:
 *     tags:
 *       - Chapters
 *     summary: Get all Quran chapters
 *     description: Retrieve a list of all chapters (Surahs) in the Quran with their metadata
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
 *         description: Successfully retrieved chapters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChaptersResponse'
 *       400:
 *         description: Request body is required
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
router.post("/", requireAccessToken, getAllChapters);

export default router;
