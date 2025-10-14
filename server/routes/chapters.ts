import express from "express";
import { getAllChapters } from "../controllers/chaptersController";
import { requireAccessToken } from "../middleware/auth";

const router = express.Router();

/**
 * @openapi
 * /api/chapters:
 *   get:
 *     tags:
 *       - Chapters
 *     summary: Get all Quran chapters
 *     description: Retrieve a list of all chapters (Surahs) in the Quran with their metadata
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved chapters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChaptersResponse'
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
router.get("/", requireAccessToken, getAllChapters);

export default router;
