export type ValidationStatus = "PASS" | "FAIL" | "UNCERTAIN";
export type OverallStatus = "COMPLIANT" | "NON_COMPLIANT" | "UNCERTAIN";

export interface ExtractionResult {
  manufacturer: { name: string; address: string; role: string };
  commodityName: string;
  netQuantity: { value: number | null; unit: string };
  date: { month: string; year: string; type: string };
  mrp: { value: number | null; currency: string; inclusiveOfAllTaxes: boolean };
  consumerCare: { phone: string; email: string; address: string };
  countryOfOrigin: string;
  unitSalePrice: { value: number | null; unit: string };
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

export interface ComplianceReport {
  overallStatus: OverallStatus;
  issueCount: number;
  results: ValidatorResult[];
  summary: string;
}

export interface ScanResponse {
  extraction: ExtractionResult;
  report: ComplianceReport;
  meta: { mode: "live" | "demo"; processingMs: number };
}

export type AppState = "idle" | "preview" | "processing" | "result";
