import { drizzle } from "drizzle-orm/postgres-js";

import { sql } from "drizzle-orm";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import * as schema from "./schema";

export const connection = postgres(
    process.env.DATABASE_URL || "postgres://dev:dev@db/hndb",
    {
        max: process.env.DB_MIGRATING || process.env.DB_SEEDING ? 1 : undefined,
    },
);

export const db = drizzle(connection, {
    schema,
    logger: true,
});



export const runMigrate = async () => {
    await db.execute(sql`CREATE SCHEMA IF NOT EXISTS hn;`);
    return migrate(db, { migrationsFolder: "src/db/migrations" });
};