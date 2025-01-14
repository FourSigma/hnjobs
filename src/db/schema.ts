
import {
    bigint,
    jsonb,
    pgSchema,
    primaryKey,
    text,
    timestamp
} from "drizzle-orm/pg-core";


const timestamptz = (colName: string) =>
    timestamp(colName, { withTimezone: true });


const dbSchema = pgSchema("hn");

export const thread = dbSchema.table("thread", {
    id: bigint({ mode: 'number' }).primaryKey(),
    title: text("title").notNull(),
    syncError: text("sync_error"),
    syncedAt: timestamptz("synced_at").notNull(),
});

export const job = dbSchema.table("job", {
    id: bigint({ mode: 'number' }).primaryKey(),
    thread_id: bigint({ mode: 'number' }).references(() => thread.id),
    user: text("user").notNull(),
    context: text("content").notNull(),
    meta: jsonb("meta").notNull().default("{}"),
    createdAt: timestamptz("created_at").notNull(),

},
    (t) => ([
        primaryKey({ columns: [t.thread_id, t.id] })
    ]),
);