import { describe, expect, it } from "vitest";
import { expiresAtFor, isExpired } from "./expiration";
describe("note expiration", () => {
  it("creates a UTC-relative expiry and supports never", () => { const from = new Date("2026-01-01T00:00:00.000Z"); expect(expiresAtFor(7, from)?.toISOString()).toBe("2026-01-08T00:00:00.000Z"); expect(expiresAtFor(null, from)).toBeNull(); });
  it("recognizes expiration from expiresAt, not job timing", () => { const now = new Date("2026-01-10T00:00:00.000Z"); expect(isExpired(new Date("2026-01-09T23:59:59.999Z"), now)).toBe(true); expect(isExpired(new Date("2026-01-10T00:00:00.001Z"), now)).toBe(false); expect(isExpired(null, now)).toBe(false); });
});
