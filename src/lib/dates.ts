export function formatDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getTodayDateInputValue() {
  return formatDateInputValue(new Date());
}

export function addDaysToDate(date: string, days: number) {
  const nextDate = new Date(`${date}T00:00:00`);
  nextDate.setDate(nextDate.getDate() + days);
  return formatDateInputValue(nextDate);
}

export function formatDate(date: string | null) {
  if (!date) {
    return "아직 없음";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
  }).format(new Date(`${date}T00:00:00`));
}

export function getEndOfCurrentWeekDateInputValue() {
  const today = new Date();
  const day = today.getDay();
  const daysUntilSunday = 6 - day;
  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + daysUntilSunday);
  return formatDateInputValue(endOfWeek);
}

export function getTodayStartDateTimeIsoString() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.toISOString();
}

export function getTomorrowDateTimeIsoString() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow.toISOString();
}
