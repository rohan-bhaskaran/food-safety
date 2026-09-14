import {
  ExtractionResult,
  ValidatorResult,
  RULE_6_REF,
  isLabelReadable,
} from "./types.js";

export function validateMrp(extraction: ExtractionResult): ValidatorResult {
  const { value, inclusiveOfAllTaxes } = extraction.mrp;
  const displayValue = value !== null ? `₹${value}` : null;

  if (value === null) {
    if (!isLabelReadable(extraction)) {
      return {
        field: "MRP",
        status: "UNCERTAIN",
        reason: "Maximum Retail Price (MRP) could not be reliably detected.",
        reference: `${RULE_6_REF}(5)`,
        value: displayValue,
      };
    }
    return {
      field: "MRP",
      status: "FAIL",
      reason: "Maximum Retail Price (MRP) is not declared on the label.",
      reference: `${RULE_6_REF}(5)`,
      value: displayValue,
    };
  }

  if (value <= 0) {
    return {
      field: "MRP",
      status: "FAIL",
      reason: "Maximum Retail Price (MRP) must be a positive value.",
      reference: `${RULE_6_REF}(5)`,
      value: displayValue,
    };
  }

  if (!inclusiveOfAllTaxes) {
    return {
      field: "MRP",
      status: "FAIL",
      reason:
        'MRP does not explicitly indicate that it is "inclusive of all taxes". The label must state this explicitly — it cannot be inferred from the MRP value alone.',
      reference: `${RULE_6_REF}(5)`,
      value: displayValue,
    };
  }

  return {
    field: "MRP",
    status: "PASS",
    reason:
      "MRP is declared and explicitly indicates it is inclusive of all taxes.",
    reference: `${RULE_6_REF}(5)`,
    value: `${displayValue} (inclusive of all taxes)`,
  };
}
