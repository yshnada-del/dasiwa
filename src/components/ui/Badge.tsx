import type { PropsWithChildren } from "react";

type BadgeTone = "rose" | "stone" | "green" | "amber";

const toneClasses: Record<BadgeTone, string> = {
  rose: "bg-dasiwa-primary-soft text-dasiwa-primary ring-dasiwa-accent/45",
  stone: "bg-white text-dasiwa-muted ring-dasiwa-border",
  green: "bg-[#E5F7EF] text-dasiwa-success ring-dasiwa-success/20",
  amber: "bg-[#FFF4D8] text-dasiwa-warning ring-dasiwa-warning/25",
};

type BadgeProps = PropsWithChildren<{ tone?: BadgeTone }>;

export function Badge({ children, tone = "stone" }: BadgeProps) {
  return <span className={["inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset", toneClasses[tone]].join(" ")}>{children}</span>;
}
