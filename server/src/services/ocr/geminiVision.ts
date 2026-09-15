import { GoogleGenerativeAI } from "@google/generative-ai";
import { ExtractionResult } from "../../validators/types.js";
import { EXTRACTION_PROMPT } from "../extraction/extractionSchema.js";
import { normalizeExtraction } from "../extraction/normalize.js";

const MODEL = "gemini-3.6-flash";

export class ExtractionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ExtractionError";
  }
}

function extractJsonFromResponse(text: string): unknown {
  const trimmed = text.trim();
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonStr = fenceMatch ? fenceMatch[1].trim() : trimmed;

  try {
    return JSON.parse(jsonStr);
  } catch {
    const start = jsonStr.indexOf("{");
    const end = jsonStr.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(jsonStr.slice(start, end + 1));
    }
    throw new ExtractionError("Failed to parse extraction response as JSON.");
  }
}

export async function extractFromImage(
  imageBuffer: Buffer,
  mimeType: string,
): Promise<ExtractionResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new ExtractionError(
      "GEMINI_API_KEY is not configured. Set it in server/.env",
    );
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: MODEL });

  const base64 = imageBuffer.toString("base64");

  const result = await model.generateContent([
    { text: EXTRACTION_PROMPT },
    {
      inlineData: {
        mimeType,
        data: base64,
      },
    },
  ]);

  const responseText = result.response.text();
  if (!responseText) {
    throw new ExtractionError("Gemini returned an empty response.");
  }

  const parsed = extractJsonFromResponse(responseText);
  return normalizeExtraction(parsed);
}
