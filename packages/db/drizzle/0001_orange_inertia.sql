CREATE TABLE IF NOT EXISTS "schedule_user" (
	"id" text PRIMARY KEY NOT NULL,
	"order" integer NOT NULL,
	"org_id" text NOT NULL,
	"schedule_id" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "schedule" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"rotation_cron" text NOT NULL,
	"enable_secondary" boolean NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "schedule_user" ADD CONSTRAINT "schedule_user_org_id_org_id_fk" FOREIGN KEY ("org_id") REFERENCES "org"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "schedule_user" ADD CONSTRAINT "schedule_user_schedule_id_schedule_id_fk" FOREIGN KEY ("schedule_id") REFERENCES "schedule"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "schedule_user" ADD CONSTRAINT "schedule_user_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "schedule" ADD CONSTRAINT "schedule_org_id_org_id_fk" FOREIGN KEY ("org_id") REFERENCES "org"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
