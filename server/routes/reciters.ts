import express from "express";
import { getAllReciters, getVersesByRubAndRecitation } from "../controllers/recitersController";
import { requireAccessToken } from "../middleware/auth";

const router = express.Router();

router.post("/", requireAccessToken, getAllReciters);
router.post("/rub/:rub_number/recitation/:recitation_id", requireAccessToken, getVersesByRubAndRecitation);

export default router;
