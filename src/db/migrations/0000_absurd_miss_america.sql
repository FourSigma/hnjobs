CREATE TABLE "hn"."job" (
	"id" bigint PRIMARY KEY NOT NULL,
	"thread_id" bigint,
	"user" text NOT NULL,
	"content" text NOT NULL,
	"meta" jsonb DEFAULT '{}' NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	CONSTRAINT "job_thread_id_id_pk" PRIMARY KEY("thread_id","id")
);
--> statement-breakpoint
CREATE TABLE "hn"."thread" (
	"id" bigint PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"sync_error" text,
	"synced_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "hn"."job" ADD CONSTRAINT "job_thread_id_thread_id_fk" FOREIGN KEY ("thread_id") REFERENCES "hn"."thread"("id") ON DELETE no action ON UPDATE no action;