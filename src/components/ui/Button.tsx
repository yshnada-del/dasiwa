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
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-rose-700 text-white hover:bg-rose-800",
  secondary: "border border-stone-300 bg-white text-stone-800 hover:bg-stone-100",
  ghost: "text-stone-600 hover:bg-stone-100 hover:text-stone-950",
};

const sizeClasses: Record<ButtonSize, string> = {
  md: "min-h-10 px-4 py-2 text-sm",
  icon: "size-10",
};

export function Button({
  asChild = false,
  children,
  className = "",
  size = "md",
  variant = "primary",
  ...props
}: ButtonProps) {
  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className,
  ].join(" ");

  if (asChild && isValidElement<AnchorHTMLAttributes<HTMLAnchorElement>>(children)) {
    return cloneElement(children, {
      className: [classes, children.props.className].filter(Boolean).join(" "),
    });
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
