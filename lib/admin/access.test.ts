import { afterEach, describe, expect, it } from "vitest";

import { getAdminAccessRedirect } from "@/lib/admin/access";

describe("getAdminAccessRedirect", () => {
  it("sends unauthenticated users on protected routes to login", () => {
    expect(getAdminAccessRedirect("/admin/archive", false)).toBe(
      "/admin/login",
    );
    expect(getAdminAccessRedirect("/admin/archive/trash", false)).toBe(
      "/admin/login",
    );
  });

  it("allows authenticated users on protected routes", () => {
    expect(getAdminAccessRedirect("/admin/archive", true)).toBeNull();
    expect(getAdminAccessRedirect("/admin/archive/trash", true)).toBeNull();
  });

  it("redirects authenticated users away from login", () => {
    expect(getAdminAccessRedirect("/admin/login", true)).toBe(
      "/admin/archive",
    );
  });

  it("allows unauthenticated users on login", () => {
    expect(getAdminAccessRedirect("/admin/login", false)).toBeNull();
  });

  it("routes /admin based on auth state", () => {
    expect(getAdminAccessRedirect("/admin", false)).toBe("/admin/login");
    expect(getAdminAccessRedirect("/admin", true)).toBe("/admin/archive");
  });
});
