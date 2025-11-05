import { ReactNode } from 'react';

interface CardProps {
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export const Card = ({ title, children, footer }: CardProps) => (
  <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
    {title ? <div className="border-b border-slate-100 px-6 py-4 text-sm font-semibold text-slate-700">{title}</div> : null}
    <div className="px-6 py-5 text-sm text-slate-600">{children}</div>
    {footer ? <div className="border-t border-slate-100 px-6 py-3 text-xs text-slate-500">{footer}</div> : null}
  </div>
);

export default Card;
