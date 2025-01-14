import { drizzle } from "drizzle-orm/postgres-js";

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



export const runMigrate = async () => { };