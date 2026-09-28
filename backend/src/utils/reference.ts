/** Generates human-friendly reference numbers, e.g. APP-2026-8F3K2Q or PAY-2026-4T9X1Z. */
export function generateReference(prefix: string): string {
  const year = new Date().getFullYear();
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I to avoid confusion
  let suffix = "";
  for (let i = 0; i < 6; i++) {
    suffix += chars[Math.floor(Math.random() * chars.length)];
  }
  return `${prefix}-${year}-${suffix}`;
}
