import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: "QuranHifz API Documentation",
  customCss: ".swagger-ui .topbar { display: none }",
}));

// Swagger JSON endpoint
app.get("/api-docs.json", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

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
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
});
