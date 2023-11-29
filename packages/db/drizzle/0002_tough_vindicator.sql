CREATE TABLE IF NOT EXISTS "rotation" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"schedule_id" text NOT NULL,
	"start_time" timestamp NOT NULL,
	"length_in_seconds" numeric NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "schedule_user" RENAME TO "rotation_user";--> statement-breakpoint
ALTER TABLE "rotation_user" DROP CONSTRAINT "schedule_user_org_id_org_id_fk";
--> statement-breakpoint
ALTER TABLE "rotation_user" DROP CONSTRAINT "schedule_user_schedule_id_schedule_id_fk";
--> statement-breakpoint
ALTER TABLE "rotation_user" DROP CONSTRAINT "schedule_user_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "schedule" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "rotation_user" ADD COLUMN "rotation_id" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rotation_user" ADD CONSTRAINT "rotation_user_org_id_org_id_fk" FOREIGN KEY ("org_id") REFERENCES "org"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rotation_user" ADD CONSTRAINT "rotation_user_rotation_id_schedule_id_fk" FOREIGN KEY ("rotation_id") REFERENCES "schedule"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rotation_user" ADD CONSTRAINT "rotation_user_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "schedule" DROP COLUMN IF EXISTS "rotation_cron";--> statement-breakpoint
ALTER TABLE "schedule" DROP COLUMN IF EXISTS "enable_secondary";--> statement-breakpoint
ALTER TABLE "rotation_user" DROP COLUMN IF EXISTS "schedule_id";--> statement-breakpoint
ALTER TABLE "rotation_user" DROP COLUMN IF EXISTS "created_at";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rotation" ADD CONSTRAINT "rotation_org_id_org_id_fk" FOREIGN KEY ("org_id") REFERENCES "org"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rotation" ADD CONSTRAINT "rotation_schedule_id_schedule_id_fk" FOREIGN KEY ("schedule_id") REFERENCES "schedule"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
