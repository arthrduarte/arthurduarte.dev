import { describe, expect, it } from "vitest";

import {
  createAdminSessionToken,
  verifyAdminSessionToken,
} from "@/lib/admin/session";

describe("admin session tokens", () => {
  const secret = "test-session-secret";

  it("creates a verifiable signed session token", () => {
    const now = 1_700_000_000_000;
    const token = createAdminSessionToken(secret, now);

    expect(verifyAdminSessionToken(token, secret, now)).toBe(true);
    expect(verifyAdminSessionToken(token, secret, now + 1000)).toBe(true);
  });

  it("rejects expired sessions", () => {
    const now = 1_700_000_000_000;
    const token = createAdminSessionToken(secret, now);

    expect(
      verifyAdminSessionToken(
        token,
        secret,
        now + 60 * 60 * 24 * 7 * 1000 + 1,
      ),
    ).toBe(false);
  });

  it("rejects tampered signatures", () => {
    const token = createAdminSessionToken(secret);
    const [payload] = token.split(".");

    expect(
      verifyAdminSessionToken(`${payload}.deadbeef`, secret),
    ).toBe(false);
  });

  it("rejects tokens signed with a different secret", () => {
    const token = createAdminSessionToken(secret);

    expect(verifyAdminSessionToken(token, "other-secret")).toBe(false);
  });
});
