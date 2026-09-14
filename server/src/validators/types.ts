export type ValidationStatus = "PASS" | "FAIL" | "UNCERTAIN";

export type ManufacturerRole = "Manufacturer" | "Packer" | "Importer" | "";

export type DateType = "manufacture" | "packing" | "import" | "";

export interface ExtractionResult {
  manufacturer: {
    name: string;
    address: string;
    role: ManufacturerRole;
  };
  commodityName: string;
  netQuantity: {
    value: number | null;
    unit: string;
  };
  date: {
    month: string;
    year: string;
    type: DateType;
  };
  mrp: {
    value: number | null;
    currency: "INR";
    inclusiveOfAllTaxes: boolean;
  };
  consumerCare: {
    phone: string;
    email: string;
    address: string;
  };
  countryOfOrigin: string;
  unitSalePrice: {
    value: number | null;
    unit: string;
  };
  confidence: Record<string, number>;
  rawText?: string;
}

export interface ValidatorResult {
  field: string;
  status: ValidationStatus;
  reason: string;
  reference: string;
  value?: string | null;
}

export type OverallStatus = "COMPLIANT" | "NON_COMPLIANT" | "UNCERTAIN";

export interface ComplianceReport {
  overallStatus: OverallStatus;
  issueCount: number;
  results: ValidatorResult[];
  summary: string;
}

export interface ScanResponse {
  extraction: ExtractionResult;
  report: ComplianceReport;
  meta: {
    mode: "live" | "demo";
    processingMs: number;
  };
}

export const RULE_6_REF = "Legal Metrology (Packaged Commodities) Rules, 2011 — Rule 6";

export const CONFIDENCE_THRESHOLD = 0.35;

export function createEmptyExtraction(): ExtractionResult {
  return {
    manufacturer: { name: "", address: "", role: "" },
    commodityName: "",
    netQuantity: { value: null, unit: "" },
    date: { month: "", year: "", type: "" },
    mrp: { value: null, currency: "INR", inclusiveOfAllTaxes: false },
    consumerCare: { phone: "", email: "", address: "" },
    countryOfOrigin: "",
    unitSalePrice: { value: null, unit: "" },
    confidence: {},
  };
}

export function getConfidence(
  extraction: ExtractionResult,
  keys: string[],
): number {
  const values = keys
    .map((key) => extraction.confidence[key])
    .filter((v): v is number => typeof v === "number");
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

export function isLabelReadable(extraction: ExtractionResult): boolean {
  const overall = extraction.confidence.overall ?? 0;
  const fieldCount = Object.keys(extraction.confidence).filter(
    (k) => k !== "overall",
  ).length;
  const hasAnyData = Boolean(
    extraction.manufacturer.name ||
      extraction.commodityName ||
      extraction.mrp.value !== null ||
      extraction.netQuantity.value !== null ||
      (extraction.rawText?.length ?? 0) > 20,
  );

  return overall >= CONFIDENCE_THRESHOLD || (fieldCount >= 2 && hasAnyData);
}
