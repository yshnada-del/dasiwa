type DasiwaLogoVariant = "full" | "symbol" | "wordmark";
type DasiwaLogoSize = "sm" | "md" | "lg";

type DasiwaLogoProps = {
  className?: string;
  size?: DasiwaLogoSize;
  variant?: DasiwaLogoVariant;
};

const sizeClasses: Record<
  DasiwaLogoSize,
  { gap: string; symbol: string; text: string }
> = {
  sm: { gap: "gap-1.5", symbol: "h-[22px] w-9", text: "text-lg" },
  md: { gap: "gap-2", symbol: "h-[30px] w-12", text: "text-[24px]" },
  lg: { gap: "gap-2.5", symbol: "h-[44px] w-[72px]", text: "text-[34px]" },
};

export function DasiwaSymbol({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 72 44"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15 17C25 38 47 38 57 17"
        stroke="url(#dasiwa-symbol-gradient)"
        strokeLinecap="round"
        strokeWidth="5.6"
      />
      <circle cx="15" cy="17" fill="#FFB6A3" r="8" />
      <circle cx="57" cy="17" fill="#D4144F" r="8" />
      <defs>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id="dasiwa-symbol-gradient"
          x1="15"
          x2="57"
          y1="17"
          y2="17"
        >
          <stop stopColor="#FFB6A3" />
          <stop offset="1" stopColor="#D4144F" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function DasiwaLogo({
  className = "",
  size = "md",
  variant = "full",
}: DasiwaLogoProps) {
  const classes = sizeClasses[size];

  if (variant === "symbol") {
    return (
      <span className={["inline-flex items-center", className].join(" ")}>
        <DasiwaSymbol className={classes.symbol} />
      </span>
    );
  }

  if (variant === "wordmark") {
    return (
      <span
        className={[
          "inline-flex items-center font-black tracking-normal text-dasiwa-text",
          classes.text,
          className,
        ].join(" ")}
      >
        다시와
      </span>
    );
  }

  return (
    <span className={["inline-flex items-center", classes.gap, className].join(" ")}>
      <DasiwaSymbol className={classes.symbol} />
      <span className={["font-black tracking-normal text-dasiwa-text", classes.text].join(" ")}>
        다시와
      </span>
    </span>
  );
}
