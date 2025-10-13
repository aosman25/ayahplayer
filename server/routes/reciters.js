const express = require("express");
const router = express.Router();
const { getAllReciters, getVersesByRubAndRecitation } = require("../controllers/recitersController");
const { requireAccessToken } = require("../middleware/auth");

router.post("/", requireAccessToken, getAllReciters);
router.post("/rub/:rub_number/recitation/:recitation_id", requireAccessToken, getVersesByRubAndRecitation);

module.exports = router;
