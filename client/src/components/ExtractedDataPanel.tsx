import { useState } from "react";
import type { ExtractionResult } from "../types/compliance";

interface ExtractedDataPanelProps {
  extraction: ExtractionResult;
}

function Row({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="grid grid-cols-3 gap-2 border-b border-gray-100 py-2 last:border-0">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="col-span-2 text-sm text-gray-900">{value}</dd>
    </div>
  );
}

export function ExtractedDataPanel({ extraction }: ExtractedDataPanelProps) {
  const [open, setOpen] = useState(false);
  const { manufacturer, date, mrp, netQuantity, consumerCare, unitSalePrice } =
    extraction;

  const dateStr =
    date.month && date.year
      ? `${date.type ? date.type.charAt(0).toUpperCase() + date.type.slice(1) + ": " : ""}${date.month}/${date.year}`
      : "";

  const netQtyStr =
    netQuantity.value !== null && netQuantity.unit
      ? `${netQuantity.value} ${netQuantity.unit}`
      : netQuantity.value !== null
        ? String(netQuantity.value)
        : "";

  const mrpStr = mrp.value !== null ? `₹${mrp.value}` : "";
  const uspStr =
    unitSalePrice.value !== null && unitSalePrice.unit
      ? `₹${unitSalePrice.value}/${unitSalePrice.unit}`
      : "";

  const careParts = [
    consumerCare.phone,
    consumerCare.email,
    consumerCare.address,
  ]
    .filter(Boolean)
    .join(" | ");

  return (
    <div className="rounded-lg border border-gray-200">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-gray-800 hover:bg-gray-50"
      >
        <span>{open ? "▼" : "▶"} View Extracted Data</span>
        <span className="text-xs font-normal text-gray-500">
          AI extraction (before rule check)
        </span>
      </button>

      {open && (
        <dl className="border-t border-gray-200 px-4 py-2">
          <Row label="Manufacturer" value={manufacturer.name} />
          <Row label="Address" value={manufacturer.address} />
          <Row label="Role" value={manufacturer.role} />
          <Row label="Commodity" value={extraction.commodityName} />
          <Row label="Net Quantity" value={netQtyStr} />
          <Row label="Date" value={dateStr} />
          <Row label="MRP" value={mrpStr} />
          <Row
            label="Inclusive of all taxes"
            value={
              mrp.value !== null
                ? mrp.inclusiveOfAllTaxes
                  ? "Yes"
                  : "No"
                : ""
            }
          />
          <Row label="Consumer Care" value={careParts} />
          <Row label="Country of Origin" value={extraction.countryOfOrigin} />
          <Row label="Unit Sale Price" value={uspStr} />
        </dl>
      )}
    </div>
  );
}
