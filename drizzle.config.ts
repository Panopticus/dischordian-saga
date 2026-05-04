// Load .env so `pnpm db:push` works locally without manually exporting
// vars. Mirrors apps/server/_core/index.ts:3 — the dev server loads it
// the same way. dotenv is silent if .env is absent, so deploy environs
// (Railway, etc.) that inject vars directly are unaffected.
import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required to run drizzle commands");
}

export default defineConfig({
  schema: "./apps/db/schema.ts",
  out: "./apps/db",
  dialect: "mysql",
  dbCredentials: {
    url: connectionString,
  },
});
