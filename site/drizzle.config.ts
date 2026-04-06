import path from "node:path";
import { defineConfig } from "drizzle-kit";

const databaseUrl = process.env.DATABASE_URL ?? path.join("data", "powerup.db");

export default defineConfig({
  dialect: "sqlite",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: databaseUrl,
  },
  strict: true,
  verbose: true,
});
