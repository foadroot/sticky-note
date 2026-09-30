export const EXPIRATION_OPTIONS = [1, 3, 7, 14, 30] as const;
export function expiresAtFor(days: number | null | undefined, from = new Date()) {
  if (days === null || days === undefined) return null;
  if (!EXPIRATION_OPTIONS.includes(days as (typeof EXPIRATION_OPTIONS)[number])) throw new Error("Invalid expiration period.");
  return new Date(from.getTime() + days * 86_400_000);
}
export const isExpired = (expiresAt: Date | null, now = new Date()) => expiresAt !== null && expiresAt <= now;
