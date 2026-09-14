import {
  ExtractionResult,
  ValidatorResult,
  RULE_6_REF,
  isLabelReadable,
} from "./types.js";

const MONTH_NAMES: Record<string, string> = {
  jan: "01",
  january: "01",
  feb: "02",
  february: "02",
  mar: "03",
  march: "03",
  apr: "04",
  april: "04",
  may: "05",
  jun: "06",
  june: "06",
  jul: "07",
  july: "07",
  aug: "08",
  august: "08",
  sep: "09",
  sept: "09",
  september: "09",
  oct: "10",
  october: "10",
  nov: "11",
  november: "11",
  dec: "12",
  december: "12",
};

function isValidMonth(month: string): boolean {
  const m = month.trim().toLowerCase();
  if (/^\d{1,2}$/.test(m)) {
    const num = parseInt(m, 10);
    return num >= 1 && num <= 12;
  }
  return m in MONTH_NAMES;
}

function isValidYear(year: string): boolean {
  return /^(19|20)\d{2}$/.test(year.trim());
}

export function validateDate(extraction: ExtractionResult): ValidatorResult {
  const { month, year, type } = extraction.date;
  const displayValue =
    month && year
      ? `${type ? type.charAt(0).toUpperCase() + type.slice(1) + ": " : ""}${month} ${year}`
      : null;

  if (!month.trim() || !year.trim()) {
    if (!isLabelReadable(extraction)) {
      return {
        field: "Month and Year",
        status: "UNCERTAIN",
        reason:
          "Month and year of manufacture, packing, or import could not be reliably detected.",
        reference: `${RULE_6_REF}(4)`,
        value: displayValue,
      };
    }
    return {
      field: "Month and Year",
      status: "FAIL",
      reason:
        "Month and year of manufacture, packing, or import is not declared on the label.",
      reference: `${RULE_6_REF}(4)`,
      value: displayValue,
    };
  }

  if (!isValidMonth(month) || !isValidYear(year)) {
    return {
      field: "Month and Year",
      status: "FAIL",
      reason:
        "Month and/or year format is invalid. Expected a valid month (e.g. Aug or 08) and four-digit year.",
      reference: `${RULE_6_REF}(4)`,
      value: displayValue,
    };
  }

  return {
    field: "Month and Year",
    status: "PASS",
    reason:
      "Month and year of manufacture, packing, or import are declared.",
    reference: `${RULE_6_REF}(4)`,
    value: displayValue,
  };
}
