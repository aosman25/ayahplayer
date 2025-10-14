import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Swagger documentation (only in development)
if (process.env.NODE_ENV !== "production") {
  import("swagger-ui-express").then((swaggerUi) => {
    import("./swagger").then(({ swaggerSpec }) => {
      app.use("/api-docs", swaggerUi.default.serve, swaggerUi.default.setup(swaggerSpec, {
        customSiteTitle: "AyahPlayer API Documentation",
        customCss: ".swagger-ui .topbar { display: none }",
      }));

      // Swagger JSON endpoint
      app.get("/api-docs.json", (_req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerSpec);
      });

      console.log(`API Documentation available at http://localhost:${process.env.PORT || 5000}/api-docs`);
    });
  });
}

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
  if (process.env.NODE_ENV !== "production") {
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  } else {
    console.log(`Environment: production (Swagger disabled)`);
  }
});
