import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export function Input({ className = "", label, id, ...props }: InputProps) {
  return (
    <label className="block">
      {label ? <span className="mb-[6px] block text-[12.5px] font-medium leading-[18.75px] tracking-[-0.1px] text-[#9b7478]">{label}</span> : null}
      <input
        id={id}
        className={[
          "h-[48px] w-full rounded-[10px] border border-[#ead8d0] bg-[#fffaf7] px-[15px] text-[14px] font-normal tracking-[-0.1px] text-dasiwa-text outline-none placeholder:text-[rgba(42,26,31,0.5)] focus:border-dasiwa-primary focus:ring-0",
          className,
        ].join(" ")}
        {...props}
      />
    </label>
  );
}