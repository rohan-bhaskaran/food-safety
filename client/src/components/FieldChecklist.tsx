import type { ValidatorResult } from "../types/compliance";

interface FieldChecklistProps {
  results: ValidatorResult[];
}

export function FieldChecklist({ results }: FieldChecklistProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-600">
        Declaration checks
      </h3>
      <ul className="space-y-2">
        {results.map((r) => (
          <li key={r.field} className="flex items-start gap-2 text-sm">
            <span
              className={
                r.status === "PASS"
                  ? "text-emerald-600"
                  : r.status === "FAIL"
                    ? "text-red-600"
                    : "text-amber-600"
              }
            >
              {r.status === "PASS" ? "✓" : r.status === "FAIL" ? "✕" : "?"}
            </span>
            <span className="text-gray-700">{r.field}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
