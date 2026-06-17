type StatCardProps = {
  label: string;
  value: string;
  helper: string;
};

export function StatCard({ helper, label, value }: StatCardProps) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-stone-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-stone-950">{value}</p>
      <p className="mt-2 text-sm text-stone-600">{helper}</p>
    </div>
  );
}
