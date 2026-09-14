export const EXTRACTION_JSON_SCHEMA = {
  manufacturer: {
    name: "string — company or entity name",
    address: "string — full postal address",
    role: "Manufacturer | Packer | Importer | empty string if unknown",
  },
  commodityName: "string — common/generic name e.g. Biscuits, Rice",
  netQuantity: {
    value: "number or null",
    unit: "string e.g. g, kg, ml, L, pieces",
  },
  date: {
    month: "string — month name or number",
    year: "string — four digit year",
    type: "manufacture | packing | import | empty string",
  },
  mrp: {
    value: "number or null",
    currency: "INR",
    inclusiveOfAllTaxes:
      "boolean — true ONLY if label explicitly states inclusive of all taxes",
  },
  consumerCare: {
    phone: "string",
    email: "string",
    address: "string",
  },
  countryOfOrigin: "string",
  unitSalePrice: {
    value: "number or null",
    unit: "string e.g. kg, L, 100 g",
  },
  confidence: {
    overall: "number 0-1",
    "manufacturer.name": "number 0-1",
    "manufacturer.address": "number 0-1",
    commodityName: "number 0-1",
    netQuantity: "number 0-1",
    date: "number 0-1",
    mrp: "number 0-1",
    consumerCare: "number 0-1",
    countryOfOrigin: "number 0-1",
    unitSalePrice: "number 0-1",
  },
  rawText: "string — all visible text on the label",
};

export const EXTRACTION_PROMPT = `You are an OCR and data extraction assistant for Indian packaged commodity labels.
Extract ONLY information that is visibly present on the label image.
Do NOT guess or fabricate any values. Use null, empty string, or false for unknown fields.

CRITICAL RULES:
1. Set mrp.inclusiveOfAllTaxes to true ONLY if the label explicitly contains text like "inclusive of all taxes", "incl. of all taxes", or equivalent. Do NOT infer this from MRP alone.
2. Return valid JSON matching this schema exactly:
${JSON.stringify(EXTRACTION_JSON_SCHEMA, null, 2)}

3. For confidence scores: 0.0 = not visible, 1.0 = clearly readable.
4. Include all visible text in rawText.
5. Detect manufacturer/packer/importer role from label keywords.
6. Normalize net quantity units where possible (grams→g, kilograms→kg, litres→L).

Return ONLY the JSON object, no markdown fences or explanation.`;
