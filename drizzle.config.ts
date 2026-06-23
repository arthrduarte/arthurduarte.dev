import { defineConfig } from "drizzle-kit";

import { getArchiveMigrationDatabaseUrl } from "@/lib/db/env";
import { loadProjectEnv } from "@/lib/db/load-env";

loadProjectEnv();

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: getArchiveMigrationDatabaseUrl(),
  },
});
