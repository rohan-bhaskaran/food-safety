import { Request, Response } from "express";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { extractFromImage, ExtractionError } from "../services/ocr/geminiVision.js";
import { normalizeExtraction } from "../services/extraction/normalize.js";
import { runComplianceEngine } from "../services/validation/complianceEngine.js";
import { ScanResponse } from "../validators/types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const ALLOWED_MIME = ["image/jpeg", "image/jpg", "image/png"];

function loadDemoExtraction(demoId: "demo-a" | "demo-b") {
  const file =
    demoId === "demo-a" ? "product-a.json" : "product-b.json";
  const path = join(__dirname, "..", "demo", file);
  const raw = JSON.parse(readFileSync(path, "utf-8"));
  return normalizeExtraction(raw);
}

export async function scanLabel(req: Request, res: Response) {
  const start = Date.now();
  const mode = (req.query.mode as string) || "live";

  try {
    let extraction;
    let scanMode: "live" | "demo" = "live";

    if (mode === "demo-a" || mode === "demo-b") {
      extraction = loadDemoExtraction(mode);
      scanMode = "demo";
    } else {
      if (!req.file) {
        res.status(400).json({
          error: "No image uploaded. Please provide a JPG, JPEG, or PNG file.",
        });
        return;
      }

      if (!ALLOWED_MIME.includes(req.file.mimetype)) {
        res.status(400).json({
          error: "Unsupported file type. Please upload JPG, JPEG, or PNG.",
        });
        return;
      }

      try {
        extraction = await extractFromImage(req.file.buffer, req.file.mimetype);
      } catch (err) {
        if (err instanceof ExtractionError) {
          res.status(502).json({
            error: err.message,
            hint: "Check GEMINI_API_KEY or try demo mode.",
          });
          return;
        }
        throw err;
      }
    }

    const report = runComplianceEngine(extraction);

    const response: ScanResponse = {
      extraction,
      report,
      meta: {
        mode: scanMode,
        processingMs: Date.now() - start,
      },
    };

    res.json(response);
  } catch (err) {
    console.error("Scan error:", err);
    res.status(500).json({
      error: "An unexpected error occurred during label analysis.",
    });
  }
}
