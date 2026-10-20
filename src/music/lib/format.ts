export function formatDate(value: string): string {
  return value.slice(0, 10).replaceAll('-', '.');
}

export function formatYear(value: string): string {
  return value.slice(0, 4);
}

export function formatDuration(ms: number): string {
  const total = Math.round(ms / 1000);
  const minutes = Math.floor(total / 60);
  const seconds = String(total % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export function formatIssueNumber(number: number): string {
  return String(number).padStart(3, '0');
}

export function formatIssueLabel(number: number): string {
  return `第 ${formatIssueNumber(number)} 期`;
}

export function humanizePlaylistUpdate(label?: string | null): string | null {
  if (!label) return null;

  const normalized = label.replace(/^Updated\s+/i, '').trim();
  const weekdays: Record<string, string> = {
    Monday: '周一',
    Tuesday: '周二',
    Wednesday: '周三',
    Thursday: '周四',
    Friday: '周五',
    Saturday: '周六',
    Sunday: '周日',
  };

  if (/^today$/i.test(normalized)) return '今天更新';
  if (/^yesterday$/i.test(normalized)) return '昨天更新';
  if (/^last week$/i.test(normalized)) return '上周更新';
  if (weekdays[normalized]) return `${weekdays[normalized]}更新`;

  const weeks = normalized.match(/^(\d+)\s+weeks?\s+ago$/i);
  if (weeks) return `${weeks[1]} 周前更新`;

  const days = normalized.match(/^(\d+)\s+days?\s+ago$/i);
  if (days) return `${days[1]} 天前更新`;

  return normalized;
}
