/** A labelled figure. Use inside a `<dl>`. */
export function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-card bg-paper p-4 shadow-paper ring-1 ring-cocoa/5">
      <dt className="text-sm text-cocoa-soft">{label}</dt>
      <dd className="mt-1 font-display text-3xl">{value}</dd>
    </div>
  );
}
