type Props = {
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
};

export function StatCard({ label, value, sub, accent }: Props) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-4 sm:p-5 fade-in">
      <div className="text-xs sm:text-sm uppercase tracking-wider text-gray-500">{label}</div>
      <div className={`mt-2 text-3xl sm:text-4xl font-extrabold ${accent ? "text-emerald-400" : "text-gray-50"}`}>
        {value}
      </div>
      {sub ? <div className="mt-1 text-xs text-gray-500">{sub}</div> : null}
    </div>
  );
}
