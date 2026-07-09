export function BarChart({
  data,
}: {
  data: { label: string; value: number; formattedValue?: string }[];
}) {
  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <div className="space-y-3">
      {data.map((d) => (
        <div key={d.label}>
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span className="truncate">{d.label}</span>
            <span className="shrink-0 font-semibold text-text">{d.formattedValue ?? d.value}</span>
          </div>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-surface">
            <div
              className="h-full rounded-full bg-accent"
              style={{ width: `${Math.max(2, (d.value / max) * 100)}%` }}
            />
          </div>
        </div>
      ))}
      {data.length === 0 && <p className="text-sm text-text-muted">Aucune donnée pour le moment.</p>}
    </div>
  );
}
