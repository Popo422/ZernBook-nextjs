import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "postgresql", // "mysql" | "sqlite"
  schema: "./src/db/drizzle/schema/*.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
});
