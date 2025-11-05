interface StatusBadgeProps {
  label: string;
  tone?: 'success' | 'warning' | 'info' | 'neutral';
}

const palette: Record<NonNullable<StatusBadgeProps['tone']>, string> = {
  success: 'bg-green-100 text-green-700',
  warning: 'bg-amber-100 text-amber-700',
  info: 'bg-blue-100 text-blue-700',
  neutral: 'bg-slate-100 text-slate-700'
};

export const StatusBadge = ({ label, tone = 'neutral' }: StatusBadgeProps) => (
  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${palette[tone]}`}>
    {label}
  </span>
);

export default StatusBadge;
