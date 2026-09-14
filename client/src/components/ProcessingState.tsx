export function ProcessingState() {
  return (
    <div className="flex flex-col items-center py-16">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
      <p className="mt-6 text-lg font-medium text-gray-800">
        Extracting declarations...
      </p>
      <p className="mt-2 text-sm text-gray-500">
        Reading label → structuring data → checking Rule 6 compliance
      </p>
    </div>
  );
}
