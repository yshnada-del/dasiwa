import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cloneElement, isValidElement } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "md" | "icon";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  children: ReactNode;
  className?: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-[14px] font-bold tracking-normal transition focus:outline-none focus:ring-2 focus:ring-dasiwa-primary/25 disabled:pointer-events-none disabled:opacity-50";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-dasiwa-primary text-white shadow-[0_8px_12px_rgba(212,20,79,0.28)] hover:bg-[#b80f42]",
  secondary: "border border-dasiwa-border bg-white text-dasiwa-text hover:bg-dasiwa-primary-soft/50",
  ghost: "text-dasiwa-muted hover:bg-dasiwa-primary-soft/60 hover:text-dasiwa-text",
};

const sizeClasses: Record<ButtonSize, string> = {
  md: "min-h-12 px-4 py-2.5 text-[14px]",
  icon: "size-9",
};

export function Button({ asChild = false, children, className = "", size = "md", variant = "primary", ...props }: ButtonProps) {
  const classes = [baseClasses, variantClasses[variant], sizeClasses[size], className].join(" ");

  if (asChild && isValidElement<AnchorHTMLAttributes<HTMLAnchorElement>>(children)) {
    return cloneElement(children, { className: [classes, children.props.className].filter(Boolean).join(" ") });
  }

  return <button className={classes} {...props}>{children}</button>;
}
