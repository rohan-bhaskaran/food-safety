import {
  ExtractionResult,
  ValidatorResult,
  RULE_6_REF,
  isLabelReadable,
} from "./types.js";

const ALLOWED_UNITS = [
  "g",
  "kg",
  "mg",
  "ml",
  "l",
  "piece",
  "pieces",
  "pc",
  "pcs",
  "unit",
  "units",
];

function normalizeUnit(unit: string): string {
  const u = unit.toLowerCase().trim();
  if (u === "gm" || u === "gram" || u === "grams") return "g";
  if (u === "kgs" || u === "kilogram" || u === "kilograms") return "kg";
  if (u === "ltr" || u === "litre" || u === "litres" || u === "liter" || u === "liters")
    return "l";
  if (u === "millilitre" || u === "millilitres" || u === "milliliter" || u === "milliliters")
    return "ml";
  return u;
}

export function validateQuantity(extraction: ExtractionResult): ValidatorResult {
  const { value, unit } = extraction.netQuantity;
  const displayValue =
    value !== null && unit ? `${value} ${unit}` : value !== null ? String(value) : null;

  if (value === null || !unit.trim()) {
    if (!isLabelReadable(extraction)) {
      return {
        field: "Net Quantity",
        status: "UNCERTAIN",
        reason: "Net quantity could not be reliably detected from the label.",
        reference: `${RULE_6_REF}(3)`,
        value: displayValue,
      };
    }
    return {
      field: "Net Quantity",
      status: "FAIL",
      reason:
        "Net quantity declaration (numeric value and unit) is missing from the label.",
      reference: `${RULE_6_REF}(3)`,
      value: displayValue,
    };
  }

  const normalizedUnit = normalizeUnit(unit);
  const isValidUnit = ALLOWED_UNITS.includes(normalizedUnit);

  if (!isValidUnit || value <= 0) {
    return {
      field: "Net Quantity",
      status: "FAIL",
      reason: isValidUnit
        ? "Net quantity value must be a positive number."
        : `Net quantity unit "${unit}" is not in a recognized standard format (g, kg, ml, L, pieces, etc.).`,
      reference: `${RULE_6_REF}(3)`,
      value: displayValue,
    };
  }

  return {
    field: "Net Quantity",
    status: "PASS",
    reason: "Net quantity is declared with a valid value and standard unit.",
    reference: `${RULE_6_REF}(3)`,
    value: displayValue,
  };
}
