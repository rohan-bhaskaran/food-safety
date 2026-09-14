import {
  createEmptyExtraction,
  ExtractionResult,
  ManufacturerRole,
  DateType,
} from "../../validators/types.js";

const MONTH_MAP: Record<string, string> = {
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

function normalizeUnit(unit: string): string {
  const u = unit.toLowerCase().trim();
  const map: Record<string, string> = {
    gm: "g",
    gms: "g",
    gram: "g",
    grams: "g",
    kgs: "kg",
    kilogram: "kg",
    kilograms: "kg",
    ltr: "L",
    litre: "L",
    litres: "L",
    liter: "L",
    liters: "L",
    ml: "ml",
    millilitre: "ml",
    milliliter: "ml",
    pc: "piece",
    pcs: "pieces",
  };
  return map[u] ?? unit.trim();
}

function normalizeMonth(month: string): string {
  const m = month.trim().toLowerCase();
  if (/^\d{1,2}$/.test(m)) {
    return m.padStart(2, "0");
  }
  return MONTH_MAP[m] ?? month.trim();
}

function parseRole(role: string): ManufacturerRole {
  const r = role.toLowerCase().trim();
  if (r.includes("import")) return "Importer";
  if (r.includes("pack")) return "Packer";
  if (r.includes("manufactur") || r.includes("mfd")) return "Manufacturer";
  return "";
}

function parseDateType(type: string): DateType {
  const t = type.toLowerCase().trim();
  if (t.includes("import")) return "import";
  if (t.includes("pack")) return "packing";
  if (t.includes("manufactur") || t.includes("mfd")) return "manufacture";
  return "";
}

function parseNumber(val: unknown): number | null {
  if (val === null || val === undefined || val === "") return null;
  const num =
    typeof val === "number"
      ? val
      : parseFloat(String(val).replace(/[₹,\s]/g, ""));
  return isNaN(num) ? null : num;
}

function str(val: unknown): string {
  if (val === null || val === undefined) return "";
  return String(val).trim();
}

export function normalizeExtraction(raw: unknown): ExtractionResult {
  const base = createEmptyExtraction();
  if (!raw || typeof raw !== "object") return base;

  const data = raw as Record<string, unknown>;

  const mfr = (data.manufacturer as Record<string, unknown>) ?? {};
  base.manufacturer = {
    name: str(mfr.name),
    address: str(mfr.address),
    role: parseRole(str(mfr.role)),
  };

  base.commodityName = str(data.commodityName);

  const nq = (data.netQuantity as Record<string, unknown>) ?? {};
  base.netQuantity = {
    value: parseNumber(nq.value),
    unit: normalizeUnit(str(nq.unit)),
  };

  const dt = (data.date as Record<string, unknown>) ?? {};
  base.date = {
    month: normalizeMonth(str(dt.month)),
    year: str(dt.year),
    type: parseDateType(str(dt.type)),
  };

  const mrp = (data.mrp as Record<string, unknown>) ?? {};
  base.mrp = {
    value: parseNumber(mrp.value),
    currency: "INR",
    inclusiveOfAllTaxes: mrp.inclusiveOfAllTaxes === true,
  };

  const cc = (data.consumerCare as Record<string, unknown>) ?? {};
  base.consumerCare = {
    phone: str(cc.phone),
    email: str(cc.email),
    address: str(cc.address),
  };

  base.countryOfOrigin = str(data.countryOfOrigin);

  const usp = (data.unitSalePrice as Record<string, unknown>) ?? {};
  base.unitSalePrice = {
    value: parseNumber(usp.value),
    unit: normalizeUnit(str(usp.unit)),
  };

  base.confidence =
    data.confidence && typeof data.confidence === "object"
      ? (data.confidence as Record<string, number>)
      : {};

  base.rawText = str(data.rawText);

  if (!base.confidence.overall) {
    const scores = Object.entries(base.confidence)
      .filter(([k]) => k !== "overall")
      .map(([, v]) => v);
    if (scores.length > 0) {
      base.confidence.overall =
        scores.reduce((a, b) => a + b, 0) / scores.length;
    }
  }

  return base;
}
