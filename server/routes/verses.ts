import express from "express";
import { getVersesByRub } from "../controllers/versesController";
import { requireAccessToken } from "../middleware/auth";

const router = express.Router();

router.post("/rub/:rub_number", requireAccessToken, getVersesByRub);

export default router;
