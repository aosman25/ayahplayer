import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Import routes
import authRoutes from "./routes/auth";
import chaptersRoutes from "./routes/chapters";
import recitersRoutes from "./routes/reciters";
import versesRoutes from "./routes/verses";

// Use routes
app.use("/api", authRoutes);
app.use("/api/chapters", chaptersRoutes);
app.use("/api/reciters", recitersRoutes);
app.use("/api/verses", versesRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
