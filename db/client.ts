import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

let cachedClient: postgres.Sql | null = null;
let cachedDb: PostgresJsDatabase<typeof schema> | null = null;

export function getDb() {
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return null;
  }

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    return null;
  }

  if (!cachedClient || !cachedDb) {
    cachedClient = postgres(connectionString, {
      max: 1,
      idle_timeout: 20,
      prepare: false,
    });
    cachedDb = drizzle(cachedClient, { schema });
  }

  return cachedDb;
}
