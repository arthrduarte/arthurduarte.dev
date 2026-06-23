import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "@/db/schema";
import { getArchiveDatabaseUrl } from "@/lib/db/env";

export function getDb() {
  const sql = neon(getArchiveDatabaseUrl());
  return drizzle(sql, { schema });
}

export type Database = ReturnType<typeof getDb>;
