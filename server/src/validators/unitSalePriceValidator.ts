import {
  ExtractionResult,
  ValidatorResult,
  RULE_6_REF,
  getConfidence,
} from "./types.js";

const VALID_UNIT_PATTERN =
  /^(?:₹?\d+(?:\.\d+)?)\s*(?:\/|per\s+)\s*(?:\d+\s*)?(g|kg|ml|l|100\s*g|100g)$/i;

export function validateUnitSalePrice(
  extraction: ExtractionResult,
): ValidatorResult {
  const { value, unit } = extraction.unitSalePrice;
  const confidence = getConfidence(extraction, ["unitSalePrice"]);
  const displayValue =
    value !== null && unit ? `₹${value}/${unit}` : value !== null ? `₹${value}` : null;

  if (value === null && !unit.trim()) {
    return {
      field: "Unit Sale Price",
      status: "PASS",
      reason:
        "Unit sale price was not detected; this check is applied only when a unit sale price declaration is present on the label.",
      reference: `${RULE_6_REF}(8) — where applicable`,
      value: null,
    };
  }

  if (value === null || !unit.trim()) {
    if (confidence < 0.25) {
      return {
        field: "Unit Sale Price",
        status: "UNCERTAIN",
        reason:
          "A unit sale price appears to be present but could not be reliably parsed.",
        reference: `${RULE_6_REF}(8)`,
        value: displayValue,
      };
    }
    return {
      field: "Unit Sale Price",
      status: "FAIL",
      reason:
        "Unit sale price declaration is incomplete (missing price value or standard unit basis).",
      reference: `${RULE_6_REF}(8)`,
      value: displayValue,
    };
  }

  const combined = `₹${value}/${unit}`;
  if (value <= 0 || !VALID_UNIT_PATTERN.test(combined.replace(/\s+/g, " "))) {
    const hasReasonableUnit =
      /g|kg|ml|l|100/i.test(unit) && value > 0;
    if (!hasReasonableUnit) {
      return {
        field: "Unit Sale Price",
        status: "FAIL",
        reason:
          "Unit sale price format is invalid. Expected format such as ₹240/kg, ₹120/L, or ₹12/100 g.",
        reference: `${RULE_6_REF}(8)`,
        value: displayValue,
      };
    }
  }

  return {
    field: "Unit Sale Price",
    status: "PASS",
    reason: "Unit sale price is declared in a valid format.",
    reference: `${RULE_6_REF}(8)`,
    value: displayValue,
  };
}
