import { validateManufacturer } from "../../validators/manufacturerValidator.js";
import { validateCommodity } from "../../validators/commodityValidator.js";
import { validateQuantity } from "../../validators/quantityValidator.js";
import { validateDate } from "../../validators/dateValidator.js";
import { validateMrp } from "../../validators/mrpValidator.js";
import { validateConsumerCare } from "../../validators/consumerCareValidator.js";
import { validateOrigin } from "../../validators/originValidator.js";
import { validateUnitSalePrice } from "../../validators/unitSalePriceValidator.js";
import {
  ComplianceReport,
  ExtractionResult,
  OverallStatus,
  ValidatorResult,
  isLabelReadable,
} from "../../validators/types.js";

function aggregateStatus(results: ValidatorResult[]): OverallStatus {
  const hasFail = results.some((r) => r.status === "FAIL");
  if (hasFail) return "NON_COMPLIANT";

  const applicable = results.filter(
    (r) => !r.reason.includes("not required") && !r.reason.includes("where applicable"),
  );
  const hasUncertain = applicable.some((r) => r.status === "UNCERTAIN");
  if (hasUncertain) return "UNCERTAIN";

  return "COMPLIANT";
}

function buildSummary(status: OverallStatus, issueCount: number): string {
  switch (status) {
    case "COMPLIANT":
      return "No violations detected in the checked declarations.";
    case "NON_COMPLIANT":
      return `${issueCount} issue${issueCount === 1 ? "" : "s"} detected on the label.`;
    case "UNCERTAIN":
      return "Some declarations could not be reliably verified. Please upload a clearer image.";
  }
}

export function runComplianceEngine(
  extraction: ExtractionResult,
): ComplianceReport {
  if (!isLabelReadable(extraction)) {
    return {
      overallStatus: "UNCERTAIN",
      issueCount: 0,
      results: [
        {
          field: "Label Readability",
          status: "UNCERTAIN",
          reason:
            "We couldn't reliably read this label. Please upload a clearer image showing the complete declaration panel.",
          reference: "Extraction confidence threshold",
          value: null,
        },
      ],
      summary:
        "We couldn't reliably read this label. Please upload a clearer image showing the complete declaration panel.",
    };
  }

  const results: ValidatorResult[] = [
    validateManufacturer(extraction),
    validateCommodity(extraction),
    validateQuantity(extraction),
    validateDate(extraction),
    validateMrp(extraction),
    validateConsumerCare(extraction),
    validateOrigin(extraction),
    validateUnitSalePrice(extraction),
  ];

  const issueCount = results.filter((r) => r.status === "FAIL").length;
  const overallStatus = aggregateStatus(results);

  return {
    overallStatus,
    issueCount,
    results,
    summary: buildSummary(overallStatus, issueCount),
  };
}
