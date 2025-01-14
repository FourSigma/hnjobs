
import { HNJobPostData } from "@/types/job";
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

export const job = dbSchema.table("job", {
    thread_id: bigint({ mode: 'number' }).notNull(),
    comment_id: bigint({ mode: 'number' }).notNull(),
    user: text("user").notNull(),
    content: text("content").notNull(),
    meta: jsonb("meta").notNull().$type<HNJobPostData>(),
    createdAt: timestamptz("created_at").notNull(),
},
    (t) => ([
        primaryKey({ columns: [t.thread_id, t.comment_id] })
    ]),
);

export type JobSelect = typeof job.$inferSelect;