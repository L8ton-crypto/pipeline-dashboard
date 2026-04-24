type Props = { status: string };

export function StatusPill({ status }: Props) {
  const s = status.toLowerCase();
  const cls =
    s === "shipped"
      ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30"
      : s === "blocked"
      ? "bg-red-500/15 text-red-300 ring-1 ring-red-500/30"
      : s === "in-progress"
      ? "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30"
      : "bg-gray-700/40 text-gray-300 ring-1 ring-gray-600/40";
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${cls}`}>
      {s || "unknown"}
    </span>
  );
}
