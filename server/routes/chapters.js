const express = require("express");
const router = express.Router();
const { getAllChapters } = require("../controllers/chaptersController");
const { requireAccessToken } = require("../middleware/auth");

router.post("/", requireAccessToken, getAllChapters);

module.exports = router;
