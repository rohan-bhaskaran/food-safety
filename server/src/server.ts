import "dotenv/config";
import express from "express";
import cors from "cors";
import scanRoutes from "./routes/scan.js";

const app = express();
const PORT = parseInt(process.env.PORT || "3001", 10);
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "Legal Metrology Compliance Scanner",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api", scanRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
