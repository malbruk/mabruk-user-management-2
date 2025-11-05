import { ReactNode } from 'react';

interface SectionHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export const SectionHeader = ({ title, description, actions }: SectionHeaderProps) => (
  <div className="flex flex-col items-end justify-between gap-3 sm:flex-row sm:items-center">
    <div className="text-right">
      <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
      {description ? <p className="text-sm text-slate-500">{description}</p> : null}
    </div>
    {actions ? <div className="flex gap-2 self-end sm:justify-end">{actions}</div> : null}
  </div>
);

export default SectionHeader;
