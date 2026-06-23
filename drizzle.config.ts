import { defineConfig } from "drizzle-kit";

import { getArchiveDatabaseUrl } from "@/lib/db/env";

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: getArchiveDatabaseUrl(),
  },
});
