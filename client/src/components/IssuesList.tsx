import type { ValidatorResult } from "../types/compliance";

interface IssuesListProps {
  results: ValidatorResult[];
}

export function IssuesList({ results }: IssuesListProps) {
  const failures = results.filter((r) => r.status === "FAIL");
  const uncertain = results.filter((r) => r.status === "UNCERTAIN");

  if (failures.length === 0 && uncertain.length === 0) return null;

  return (
    <div className="space-y-6">
      {failures.length > 0 && (
        <div>
          <h3 className="mb-3 text-lg font-semibold text-red-800">
            Issues found
          </h3>
          <ul className="space-y-4">
            {failures.map((issue) => (
              <li
                key={issue.field}
                className="rounded-lg border border-red-200 bg-red-50 p-4"
              >
                <p className="font-semibold text-red-900">{issue.field}</p>
                <p className="mt-1 text-sm text-red-800">{issue.reason}</p>
                <p className="mt-2 text-xs text-red-600">{issue.reference}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {uncertain.length > 0 && (
        <div>
          <h3 className="mb-3 text-lg font-semibold text-amber-800">
            Could not verify
          </h3>
          <ul className="space-y-4">
            {uncertain.map((issue) => (
              <li
                key={issue.field}
                className="rounded-lg border border-amber-200 bg-amber-50 p-4"
              >
                <p className="font-semibold text-amber-900">{issue.field}</p>
                <p className="mt-1 text-sm text-amber-800">{issue.reason}</p>
                <p className="mt-2 text-xs text-amber-600">{issue.reference}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
