import {
  ExtractionResult,
  ValidatorResult,
  RULE_6_REF,
  getConfidence,
} from "./types.js";

const IMPORT_KEYWORDS = [
  "imported",
  "import ",
  "country of origin",
  "product of",
  "made in china",
  "made in usa",
  "made in u.s.a",
  "made in vietnam",
  "made in thailand",
  "made in indonesia",
  "made in malaysia",
  "made in sri lanka",
  "made in bangladesh",
  "made in nepal",
  "made in pakistan",
];

const DOMESTIC_KEYWORDS = [
  "made in india",
  "product of india",
  "country of origin: india",
  "country of origin india",
  "manufactured in india",
];

function textContains(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.some((kw) => lower.includes(kw));
}

function isImportedProduct(extraction: ExtractionResult): boolean | null {
  const rawText = extraction.rawText ?? "";
  const role = extraction.manufacturer.role;
  const origin = extraction.countryOfOrigin.trim().toLowerCase();

  if (role === "Importer") return true;

  if (origin && origin !== "india" && !origin.includes("india")) {
    return true;
  }

  if (textContains(rawText, DOMESTIC_KEYWORDS)) return false;
  if (origin === "india" || origin.includes("india")) return false;

  if (textContains(rawText, IMPORT_KEYWORDS)) {
    if (textContains(rawText, DOMESTIC_KEYWORDS)) return false;
    return true;
  }

  if (role === "Manufacturer" || role === "Packer") {
    return false;
  }

  return null;
}

export function validateOrigin(extraction: ExtractionResult): ValidatorResult {
  const origin = extraction.countryOfOrigin.trim();
  const importStatus = isImportedProduct(extraction);
  const confidence = getConfidence(extraction, ["countryOfOrigin"]);

  if (importStatus === false) {
    return {
      field: "Country of Origin",
      status: "PASS",
      reason:
        "Product appears to be domestically manufactured; country of origin declaration is not required in this case.",
      reference: `${RULE_6_REF}(7) — applicable to imported commodities`,
      value: origin || "India (domestic)",
    };
  }

  if (importStatus === null) {
    if (confidence < 0.2) {
      return {
        field: "Country of Origin",
        status: "UNCERTAIN",
        reason:
          "Unable to determine whether the product is imported; country of origin applicability is unclear.",
        reference: `${RULE_6_REF}(7)`,
        value: origin || null,
      };
    }
    return {
      field: "Country of Origin",
      status: "PASS",
      reason:
        "Import status could not be conclusively determined; no country of origin violation flagged for domestic products.",
      reference: `${RULE_6_REF}(7) — applicable to imported commodities`,
      value: origin || null,
    };
  }

  if (!origin) {
    return {
      field: "Country of Origin",
      status: "FAIL",
      reason:
        "Country of origin declaration is required for imported products but was not detected on the label.",
      reference: `${RULE_6_REF}(7)`,
      value: null,
    };
  }

  return {
    field: "Country of Origin",
    status: "PASS",
    reason: "Country of origin is declared for this imported product.",
    reference: `${RULE_6_REF}(7)`,
    value: origin,
  };
}
