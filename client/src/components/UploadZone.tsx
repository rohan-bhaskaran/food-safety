interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  onDemoSelect: (mode: "demo-a" | "demo-b") => void;
}

export function UploadZone({ onFileSelect, onDemoSelect }: UploadZoneProps) {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
    e.target.value = "";
  };

  return (
    <div className="space-y-6">
      <label className="block cursor-pointer">
        <div className="rounded-xl border-2 border-dashed border-emerald-400 bg-emerald-50 px-8 py-14 text-center transition hover:border-emerald-500 hover:bg-emerald-100">
          <p className="text-lg font-semibold text-emerald-800">
            UPLOAD PRODUCT LABEL
          </p>
          <p className="mt-2 text-sm text-emerald-600">
            JPG, JPEG, or PNG — click to browse
          </p>
        </div>
        <input
          type="file"
          accept="image/jpeg,image/jpg,image/png"
          className="hidden"
          onChange={handleFile}
        />
      </label>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <label className="cursor-pointer rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
          Use Camera
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            capture="environment"
            className="hidden"
            onChange={handleFile}
          />
        </label>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <p className="mb-3 text-center text-xs font-medium uppercase tracking-wide text-gray-500">
          Demo Samples (cached extraction)
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => onDemoSelect("demo-a")}
            className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700"
          >
            Test Product A — Compliant
          </button>
          <button
            type="button"
            onClick={() => onDemoSelect("demo-b")}
            className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
          >
            Test Product B — Non-Compliant
          </button>
        </div>
      </div>
    </div>
  );
}
