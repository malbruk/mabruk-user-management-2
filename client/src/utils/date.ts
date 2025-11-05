export const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

export const addMonths = (date: Date, months: number) => {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
};

export const formatISO = (date: Date) => date.toISOString();

export const formatDate = (iso: string | undefined) => {
  if (!iso) return '—';
  return new Intl.DateTimeFormat('he-IL', { dateStyle: 'medium' }).format(new Date(iso));
};
