import {
  ExtractionResult,
  ValidatorResult,
  RULE_6_REF,
  getConfidence,
  isLabelReadable,
} from "./types.js";

export function validateManufacturer(
  extraction: ExtractionResult,
): ValidatorResult {
  const { name, address, role } = extraction.manufacturer;
  const confidence = getConfidence(extraction, [
    "manufacturer.name",
    "manufacturer.address",
  ]);
  const displayValue = [name, address, role].filter(Boolean).join(" | ") || null;

  if (!isLabelReadable(extraction) && confidence < 0.2) {
    return {
      field: "Manufacturer / Packer / Importer",
      status: "UNCERTAIN",
      reason:
        "Manufacturer or packer details could not be reliably read from the label image.",
      reference: `${RULE_6_REF}(1)`,
      value: displayValue,
    };
  }

  const hasName = name.trim().length >= 2;
  const hasAddress = address.trim().length >= 10;

  if (hasName && hasAddress) {
    return {
      field: "Manufacturer / Packer / Importer",
      status: "PASS",
      reason: "Name and address of manufacturer/packer/importer are present.",
      reference: `${RULE_6_REF}(1)`,
      value: displayValue,
    };
  }

  if (!hasName && !hasAddress) {
    return {
      field: "Manufacturer / Packer / Importer",
      status: "FAIL",
      reason:
        "Name and address of the manufacturer, packer, or importer were not detected on the label.",
      reference: `${RULE_6_REF}(1)`,
      value: displayValue,
    };
  }

  return {
    field: "Manufacturer / Packer / Importer",
    status: "FAIL",
    reason: hasName
      ? "Full address of the manufacturer, packer, or importer is missing or incomplete."
      : "Name of the manufacturer, packer, or importer is missing.",
    reference: `${RULE_6_REF}(1)`,
    value: displayValue,
  };
}
