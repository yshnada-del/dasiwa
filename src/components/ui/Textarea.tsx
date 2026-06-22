import type { TextareaHTMLAttributes } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string };

export function Textarea({ className = "", label, id, ...props }: TextareaProps) {
  return (
    <label className="block">
      {label ? <span className="mb-[6px] block text-[12.5px] font-medium leading-[18.75px] tracking-[-0.1px] text-[#9b7478]">{label}</span> : null}
      <textarea
        id={id}
        className={[
          "min-h-28 w-full resize-y rounded-[10px] border border-[#ead8d0] bg-[#fffaf7] px-[15px] py-3 text-[14px] font-normal tracking-[-0.1px] text-dasiwa-text outline-none placeholder:text-[rgba(42,26,31,0.5)] focus:border-dasiwa-primary focus:ring-0",
          className,
        ].join(" ")}
        {...props}
      />
    </label>
  );
}