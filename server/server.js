const express = require("express");
const cors = require("cors");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require("./routes/auth");
const chaptersRoutes = require("./routes/chapters");
const recitersRoutes = require("./routes/reciters");
const versesRoutes = require("./routes/verses");

// Use routes
app.use("/api", authRoutes);
app.use("/api/chapters", chaptersRoutes);
app.use("/api/reciters", recitersRoutes);
app.use("/api/verses", versesRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
