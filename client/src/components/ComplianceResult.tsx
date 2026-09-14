import type { OverallStatus } from "../types/compliance";

interface ComplianceResultProps {
  status: OverallStatus;
  issueCount: number;
  summary: string;
  isDemo: boolean;
}

const config = {
  COMPLIANT: {
    bg: "bg-emerald-50 border-emerald-300",
    text: "text-emerald-800",
    icon: "✓",
    label: "COMPLIANT",
  },
  NON_COMPLIANT: {
    bg: "bg-red-50 border-red-300",
    text: "text-red-800",
    icon: "✕",
    label: "NON-COMPLIANT",
  },
  UNCERTAIN: {
    bg: "bg-amber-50 border-amber-300",
    text: "text-amber-800",
    icon: "?",
    label: "UNCERTAIN",
  },
};

export function ComplianceResult({
  status,
  issueCount,
  summary,
  isDemo,
}: ComplianceResultProps) {
  const c = config[status];

  return (
    <div className="space-y-3">
      {isDemo && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-center text-sm font-medium text-blue-800">
          Demo mode — cached extraction (not live Gemini analysis)
        </div>
      )}

      <div
        className={`rounded-xl border-2 ${c.bg} px-6 py-10 text-center`}
      >
        <p className={`text-5xl font-bold ${c.text}`}>
          {c.icon} {c.label}
        </p>
        {status === "NON_COMPLIANT" && (
          <p className={`mt-3 text-xl font-semibold ${c.text}`}>
            {issueCount} issue{issueCount === 1 ? "" : "s"} detected
          </p>
        )}
        <p className={`mt-4 text-base ${c.text} opacity-90`}>{summary}</p>
      </div>
    </div>
  );
}
