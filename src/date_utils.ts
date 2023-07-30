/** @returns number milliseconds representing today. */
export function today(): number {
  const now = new Date(Date.now());
  const today = Date.parse(now.toDateString());
  return today;
}

/** @returns string human readable time until tomorrow. */
export function timeUntilTomorrow(): string {
  const today2 = today();
  const tomorrow = today2 + 24 * 60 * 60 * 1000;
  const diff = tomorrow - Date.now();
  const diffDate = new Date(diff);
  return `${diffDate.getUTCHours()}h ${diffDate.getUTCMinutes()}m`;
}
