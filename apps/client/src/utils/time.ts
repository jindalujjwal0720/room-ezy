export const formatDateTime = (date: string): string => {
  const d = new Date(date);
  return Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'medium',
  }).format(d);
};
