import { afterEach, describe, expect, it } from "vitest";

import {
  getArchiveDatabaseUrl,
  getArchiveMigrationDatabaseUrl,
} from "@/lib/db/env";

const ENV_KEYS = [
  "STORAGE_DATABASE_URL",
  "POSTGRES_URL",
  "DATABASE_URL",
  "STORAGE_DATABASE_URL_UNPOOLED",
  "POSTGRES_URL_NON_POOLING",
  "DATABASE_URL_UNPOOLED",
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

describe("getArchiveMigrationDatabaseUrl", () => {
  afterEach(() => {
    for (const key of ENV_KEYS) {
      delete process.env[key];
    }
  });

  it("prefers unpooled env vars for migrations", () => {
    process.env.STORAGE_DATABASE_URL_UNPOOLED =
      "postgres://storage-direct";
    process.env.STORAGE_DATABASE_URL =
      "postgres://storage-pooler?sslmode=require";

    expect(getArchiveMigrationDatabaseUrl()).toBe(
      "postgres://storage-direct?sslmode=require",
    );
  });

  it("derives a direct Neon URL from pooled storage URL", () => {
    process.env.STORAGE_DATABASE_URL =
      "postgres://user:pass@ep-example-pooler.us-east-1.aws.neon.tech/neondb";

    expect(getArchiveMigrationDatabaseUrl()).toBe(
      "postgres://user:pass@ep-example.us-east-1.aws.neon.tech/neondb?sslmode=require",
    );
  });
});
