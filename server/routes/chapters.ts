import express from "express";
import { getAllChapters } from "../controllers/chaptersController";
import { requireAccessToken } from "../middleware/auth";

const router = express.Router();

router.post("/", requireAccessToken, getAllChapters);

export default router;
