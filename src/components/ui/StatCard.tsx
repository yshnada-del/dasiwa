export function StatCard({ helper, label, value }: { helper?: string; label: string; value: string }) {
  return (
    <div className="rounded-[18px] bg-white px-4 py-4">
      <p className="text-[12px] font-bold text-dasiwa-muted">{label}</p>
      <p className="mt-2 text-[22px] font-black text-dasiwa-text">{value}</p>
      {helper ? <p className="mt-1 text-[11px] text-dasiwa-muted">{helper}</p> : null}
    </div>
  );
}
