CREATE TABLE "hn"."job" (
	"comment_id" bigint,
	"thread_id" bigint,
	"user" text NOT NULL,
	"content" text NOT NULL,
	"meta" jsonb DEFAULT '{}' NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	CONSTRAINT "job_thread_id_comment_id_pk" PRIMARY KEY("thread_id","comment_id")
);
