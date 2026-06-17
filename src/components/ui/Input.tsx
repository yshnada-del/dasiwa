import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export function Input({ className = "", label, id, ...props }: InputProps) {
  return (
    <label className="block">
      {label ? (
        <span className="mb-1.5 block text-sm font-medium text-stone-700">{label}</span>
      ) : null}
      <input
        id={id}
        className={[
          "h-11 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm text-stone-950 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-100",
          className,
        ].join(" ")}
        {...props}
      />
    </label>
  );
}
