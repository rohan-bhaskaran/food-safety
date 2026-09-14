import {
  ExtractionResult,
  ValidatorResult,
  RULE_6_REF,
  isLabelReadable,
} from "./types.js";

export function validateCommodity(extraction: ExtractionResult): ValidatorResult {
  const name = extraction.commodityName.trim();

  if (!name) {
    if (!isLabelReadable(extraction)) {
      return {
        field: "Commodity Name",
        status: "UNCERTAIN",
        reason:
          "Common or generic name of the commodity could not be reliably detected.",
        reference: `${RULE_6_REF}(2)`,
        value: null,
      };
    }
    return {
      field: "Commodity Name",
      status: "FAIL",
      reason:
        "Common or generic name of the commodity is not declared on the label.",
      reference: `${RULE_6_REF}(2)`,
      value: null,
    };
  }

  return {
    field: "Commodity Name",
    status: "PASS",
    reason: "Common or generic name of the commodity is present.",
    reference: `${RULE_6_REF}(2)`,
    value: name,
  };
}
