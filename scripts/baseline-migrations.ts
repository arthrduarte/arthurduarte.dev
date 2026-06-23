import { readMigrationFiles } from "drizzle-orm/migrator";
import { Client } from "pg";

import { getArchiveMigrationDatabaseUrl } from "@/lib/db/env";
import { loadProjectEnv } from "@/lib/db/load-env";

loadProjectEnv();

const migrations = readMigrationFiles({ migrationsFolder: "./drizzle" });
const client = new Client({
  connectionString: getArchiveMigrationDatabaseUrl(),
});

try {
  await client.connect();

  for (const migration of migrations) {
    const existing = await client.query(
      'SELECT hash FROM drizzle."__drizzle_migrations" WHERE hash = $1',
      [migration.hash],
    );

    if (existing.rowCount === 0) {
      await client.query(
        'INSERT INTO drizzle."__drizzle_migrations" (hash, created_at) VALUES ($1, $2)',
        [migration.hash, migration.folderMillis],
      );
      console.log(`Baselined migration ${migration.hash.slice(0, 8)}...`);
    }
  }

  console.log("Migration journal is up to date.");
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
} finally {
  await client.end();
}
