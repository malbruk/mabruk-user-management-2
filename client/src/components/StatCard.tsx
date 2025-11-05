import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: ReactNode;
  subtitle?: string;
  accent?: 'primary' | 'secondary' | 'accent';
}

const accentClasses: Record<NonNullable<StatCardProps['accent']>, string> = {
  primary: 'from-primary/90 to-primary',
  secondary: 'from-secondary/90 to-secondary',
  accent: 'from-accent/90 to-accent'
};

export const StatCard = ({ title, value, subtitle, accent = 'primary' }: StatCardProps) => (
  <div className={`rounded-2xl bg-gradient-to-br ${accentClasses[accent]} p-px shadow-lg`}>
    <div className="h-full rounded-[15px] bg-white p-6 text-right">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">{title}</p>
      <div className="mt-3 text-3xl font-semibold text-slate-900">{value}</div>
      {subtitle ? <p className="mt-2 text-sm text-slate-500">{subtitle}</p> : null}
    </div>
  </div>
);

export default StatCard;
