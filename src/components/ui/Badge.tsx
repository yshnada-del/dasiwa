import type { PropsWithChildren } from "react";

type BadgeTone = "rose" | "stone" | "green" | "amber";

const toneClasses: Record<BadgeTone, string> = {
  rose: "bg-rose-50 text-rose-700 ring-rose-200",
  stone: "bg-stone-100 text-stone-700 ring-stone-200",
  green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  amber: "bg-amber-50 text-amber-800 ring-amber-200",
};

type BadgeProps = PropsWithChildren<{
  tone?: BadgeTone;
}>;

export function Badge({ children, tone = "stone" }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        toneClasses[tone],
      ].join(" ")}
    >
      {children}
    </span>
  );
}
