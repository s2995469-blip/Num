import { defineConfig } from "drizzle-kit";

// Load .env.local for CLI use; deployed environments provide real env vars.
try {
  process.loadEnvFile(".env.local");
} catch {}

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL ?? "" },
  strict: true,
});
