import type { ReactNode } from "react";

type PageHeaderProps = {
  actions?: ReactNode;
  description?: string;
  eyebrow?: string;
  title: string;
};

export function PageHeader({ actions, description, eyebrow, title }: PageHeaderProps) {
  return (
    <header className="mb-5">
      {eyebrow ? <p className="text-[13px] font-medium text-dasiwa-muted">{eyebrow}</p> : null}
      <div className="mt-1 flex items-end justify-between gap-4">
        <h1 className="text-[26px] font-black leading-[34px] text-dasiwa-text">{title}</h1>
        {actions}
      </div>
      {description ? <p className="mt-1 text-[13px] leading-5 text-dasiwa-muted">{description}</p> : null}
    </header>
  );
}
