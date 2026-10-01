import "server-only";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

/** False when the site is deployed as a frontend only (no DATABASE_URL). */
export const isDatabaseConfigured = Boolean(process.env.DATABASE_URL);

declare global {
  var __phPool: Pool | undefined;
}

function createPool() {
  const connectionString = process.env.DATABASE_URL;
  // Don't throw at import time (that would break builds); queries will fail
  // and the routes return a friendly 500 instead.
  if (!connectionString) console.error("[db] DATABASE_URL is not set. See README.md → Environment variables.");
  return new Pool({
    connectionString,
    max: Number(process.env.DATABASE_POOL_MAX ?? 5),
    ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: true } : undefined,
  });
}

// Reuse one pool across hot reloads in development.
const pool = globalThis.__phPool ?? createPool();
if (process.env.NODE_ENV !== "production") globalThis.__phPool = pool;

export const db = drizzle(pool, { schema });
export { schema };
