/** Returns a promise that resolves after N milliseconds. */
export function wait(ms: number): Promise<void> {
  return new Promise((res) => {
    setTimeout(res, ms);
  });
}
