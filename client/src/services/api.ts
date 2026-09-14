import type { ScanResponse } from "../types/compliance";

const API_BASE = import.meta.env.VITE_API_URL || "";

export async function scanLabel(
  file: File | null,
  mode: "live" | "demo-a" | "demo-b" = "live",
): Promise<ScanResponse> {
  const url = `${API_BASE}/api/scan?mode=${mode}`;

  if (mode !== "live") {
    const res = await fetch(url, { method: "POST" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Scan failed (${res.status})`);
    }
    return res.json();
  }

  if (!file) throw new Error("No image selected.");

  const form = new FormData();
  form.append("image", file);

  const res = await fetch(url, { method: "POST", body: form });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Scan failed (${res.status})`);
  }
  return res.json();
}
