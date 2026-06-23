import { scryptSync } from "node:crypto";
import { afterEach, describe, expect, it } from "vitest";

import { verifyDashboardPassword } from "@/lib/admin/password";

describe("verifyDashboardPassword", () => {
  afterEach(() => {
    delete process.env.DASHBOARD_PASSWORD;
    delete process.env.DASHBOARD_PASSWORD_HASH;
  });

  it("accepts a matching plain dashboard password", () => {
    process.env.DASHBOARD_PASSWORD = "secret-password";

    expect(verifyDashboardPassword("secret-password")).toBe(true);
    expect(verifyDashboardPassword("wrong-password")).toBe(false);
  });

  it("accepts a matching scrypt password hash", () => {
    const salt = "testsalt";
    const hash = scryptSync("secret-password", salt, 64).toString("hex");
    process.env.DASHBOARD_PASSWORD_HASH = `scrypt:${salt}:${hash}`;

    expect(verifyDashboardPassword("secret-password")).toBe(true);
    expect(verifyDashboardPassword("wrong-password")).toBe(false);
  });

  it("returns false when no password is configured", () => {
    expect(verifyDashboardPassword("anything")).toBe(false);
  });
});
