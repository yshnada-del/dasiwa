import type { TextareaHTMLAttributes } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
};

export function Textarea({ className = "", label, id, ...props }: TextareaProps) {
  return (
    <label className="block">
      {label ? (
        <span className="mb-1.5 block text-sm font-medium text-stone-700">{label}</span>
      ) : null}
      <textarea
        id={id}
        className={[
          "min-h-28 w-full resize-y rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-950 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-100",
          className,
        ].join(" ")}
        {...props}
      />
    </label>
  );
}
