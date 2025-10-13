const express = require("express");
const router = express.Router();
const { getVersesByRub } = require("../controllers/versesController");
const { requireAccessToken } = require("../middleware/auth");

router.post("/rub/:rub_number", requireAccessToken, getVersesByRub);

module.exports = router;
