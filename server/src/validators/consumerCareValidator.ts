import {
  ExtractionResult,
  ValidatorResult,
  RULE_6_REF,
  isLabelReadable,
} from "./types.js";

function hasContactInfo(extraction: ExtractionResult): boolean {
  const { phone, email, address } = extraction.consumerCare;
  return (
    phone.trim().length >= 6 ||
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
    address.trim().length >= 10
  );
}

export function validateConsumerCare(
  extraction: ExtractionResult,
): ValidatorResult {
  const { phone, email, address } = extraction.consumerCare;
  const parts = [phone, email, address].filter(Boolean);
  const displayValue = parts.length > 0 ? parts.join(" | ") : null;

  if (!hasContactInfo(extraction)) {
    if (!isLabelReadable(extraction)) {
      return {
        field: "Consumer Care",
        status: "UNCERTAIN",
        reason:
          "Consumer complaint/contact details could not be reliably detected from the label.",
        reference: `${RULE_6_REF}(6)`,
        value: displayValue,
      };
    }
    return {
      field: "Consumer Care",
      status: "FAIL",
      reason:
        "Consumer complaint/contact information (telephone, email, or address) was not detected on the label.",
      reference: `${RULE_6_REF}(6)`,
      value: displayValue,
    };
  }

  return {
    field: "Consumer Care",
    status: "PASS",
    reason: "Consumer complaint/contact information is present on the label.",
    reference: `${RULE_6_REF}(6)`,
    value: displayValue,
  };
}
