const DATABASE_URL_ENV_KEYS = [
  "STORAGE_DATABASE_URL",
  "POSTGRES_URL",
  "DATABASE_URL",
] as const;

export function getArchiveDatabaseUrl(): string {
  for (const key of DATABASE_URL_ENV_KEYS) {
    const value = process.env[key];

    if (value) {
      return value;
    }
  }

  throw new Error(
    `Missing archive database URL. Set one of: ${DATABASE_URL_ENV_KEYS.join(", ")}`,
  );
}
