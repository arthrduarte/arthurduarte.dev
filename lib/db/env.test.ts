import { afterEach, describe, expect, it } from "vitest";

import { getArchiveDatabaseUrl } from "@/lib/db/env";

const ENV_KEYS = [
  "STORAGE_DATABASE_URL",
  "POSTGRES_URL",
  "DATABASE_URL",
] as const;

describe("getArchiveDatabaseUrl", () => {
  afterEach(() => {
    for (const key of ENV_KEYS) {
      delete process.env[key];
    }
  });

  it("prefers STORAGE_DATABASE_URL when present", () => {
    process.env.STORAGE_DATABASE_URL = "postgres://storage";
    process.env.POSTGRES_URL = "postgres://postgres";
    process.env.DATABASE_URL = "postgres://database";

    expect(getArchiveDatabaseUrl()).toBe("postgres://storage");
  });

  it("falls back to POSTGRES_URL and DATABASE_URL", () => {
    process.env.POSTGRES_URL = "postgres://postgres";
    process.env.DATABASE_URL = "postgres://database";

    expect(getArchiveDatabaseUrl()).toBe("postgres://postgres");
  });

  it("throws when no database URL is configured", () => {
    expect(() => getArchiveDatabaseUrl()).toThrow(
      "Missing archive database URL",
    );
  });
});
