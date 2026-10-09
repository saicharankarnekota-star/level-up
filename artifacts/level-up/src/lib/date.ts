/** YYYY-MM-DD in the learner's local timezone. */
export function localDate(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function parse(date: string): Date {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function daysBetween(from: string, to: string): number {
  return Math.round((parse(to).getTime() - parse(from).getTime()) / 86_400_000);
}

export function addDays(date: string, n: number): string {
  const d = parse(date);
  d.setDate(d.getDate() + n);
  return localDate(d);
}

export function weekdayShort(date: string): string {
  return parse(date).toLocaleDateString(undefined, { weekday: 'short' });
}

export function friendlyDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}
