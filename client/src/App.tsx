import { useState } from "react";
import { UploadZone } from "./components/UploadZone";
import { ProcessingState } from "./components/ProcessingState";
import { ComplianceResult } from "./components/ComplianceResult";
import { IssuesList } from "./components/IssuesList";
import { FieldChecklist } from "./components/FieldChecklist";
import { ExtractedDataPanel } from "./components/ExtractedDataPanel";
import { scanLabel } from "./services/api";
import type { AppState, ScanResponse } from "./types/compliance";

function App() {
  const [state, setState] = useState<AppState>("idle");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<ScanResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setState("idle");
    setPreviewUrl(null);
    setSelectedFile(null);
    setResult(null);
    setError(null);
  };

  const handleFileSelect = (file: File) => {
    if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      setError("Please upload a JPG, JPEG, or PNG image.");
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setState("preview");
    setError(null);
  };

  const runScan = async (
    file: File | null,
    mode: "live" | "demo-a" | "demo-b" = "live",
  ) => {
    setState("processing");
    setError(null);
    try {
      const response = await scanLabel(file, mode);
      setResult(response);
      setState("result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Scan failed.");
      setState(previewUrl ? "preview" : "idle");
    }
  };

  const handleDemo = (mode: "demo-a" | "demo-b") => {
    setPreviewUrl(null);
    setSelectedFile(null);
    runScan(null, mode);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-2xl px-4 py-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
            SIH26034 · Ministry of Consumer Affairs
          </p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
            Legal Metrology Compliance Scanner
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Scan → Extract → Validate → Explain
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8">
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}

        {state === "idle" && (
          <UploadZone
            onFileSelect={handleFileSelect}
            onDemoSelect={handleDemo}
          />
        )}

        {state === "preview" && previewUrl && (
          <div className="space-y-6">
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <img
                src={previewUrl}
                alt="Product label preview"
                className="max-h-80 w-full object-contain"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => runScan(selectedFile, "live")}
                className="flex-1 rounded-lg bg-emerald-600 px-6 py-3 text-base font-semibold text-white transition hover:bg-emerald-700"
              >
                Analyze Label
              </button>
              <button
                type="button"
                onClick={reset}
                className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {state === "processing" && <ProcessingState />}

        {state === "result" && result && (
          <div className="space-y-6">
            <ComplianceResult
              status={result.report.overallStatus}
              issueCount={result.report.issueCount}
              summary={result.report.summary}
              isDemo={result.meta.mode === "demo"}
            />

            <IssuesList results={result.report.results} />

            <FieldChecklist results={result.report.results} />

            <ExtractedDataPanel extraction={result.extraction} />

            <div className="flex items-center justify-between border-t border-gray-200 pt-4 text-xs text-gray-500">
              <span>Processed in {result.meta.processingMs}ms</span>
              <button
                type="button"
                onClick={reset}
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                Scan Another Label
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-gray-200 bg-white py-4">
        <p className="text-center text-xs text-gray-500">
          Prototype decision-support system — not an official legal inspection
          tool. AI reads the label; deterministic code checks Rule 6 compliance.
        </p>
      </footer>
    </div>
  );
}

export default App;
