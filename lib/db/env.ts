const DATABASE_URL_ENV_KEYS = [
  "STORAGE_DATABASE_URL",
  "POSTGRES_URL",
  "DATABASE_URL",
] as const;

const MIGRATION_DATABASE_URL_ENV_KEYS = [
  "STORAGE_DATABASE_URL_UNPOOLED",
  "POSTGRES_URL_NON_POOLING",
  "DATABASE_URL_UNPOOLED",
] as const;

function readFirstEnv(keys: readonly string[]): string | undefined {
  for (const key of keys) {
    const value = process.env[key];

    if (value) {
      return value;
    }
  }

  return undefined;
}

function toDirectNeonUrl(url: string): string {
  return url.replace("-pooler.", ".");
}

function ensureSslMode(url: string): string {
  if (url.includes("sslmode=")) {
    return url;
  }

  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}sslmode=require`;
}

export function getArchiveDatabaseUrl(): string {
  const url = readFirstEnv(DATABASE_URL_ENV_KEYS);

  if (!url) {
    throw new Error(
      `Missing archive database URL. Set one of: ${DATABASE_URL_ENV_KEYS.join(", ")}`,
    );
  }

  return url;
}

export function getArchiveMigrationDatabaseUrl(): string {
  const directUrl = readFirstEnv(MIGRATION_DATABASE_URL_ENV_KEYS);

  if (directUrl) {
    return ensureSslMode(directUrl);
  }

  return ensureSslMode(toDirectNeonUrl(getArchiveDatabaseUrl()));
}
