import express from "express";
import { getToken } from "../controllers/authController";

const router = express.Router();

/**
 * @openapi
 * /api/token:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Get OAuth2 access token
 *     description: Obtain an access token for authenticating API requests
 *     responses:
 *       200:
 *         description: Successfully retrieved access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenResponse'
 *       500:
 *         description: Failed to get access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/token", getToken);

export default router;
