ALTER TYPE "escalation_policy_step_type" ADD VALUE 'SCHEDULE';--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "schedule_user" (
	"id" text PRIMARY KEY NOT NULL,
	"order" integer NOT NULL,
	"org_id" text NOT NULL,
	"schedule_id" text NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "team" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "rotation_user";--> statement-breakpoint
DROP TABLE "rotation";--> statement-breakpoint
ALTER TABLE "escalation_policy_step" DROP CONSTRAINT "escalation_policy_step_rotation_id_rotation_id_fk";
--> statement-breakpoint
ALTER TABLE "schedule" ADD COLUMN "team_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "schedule" ADD COLUMN "start_time" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "schedule" ADD COLUMN "length_in_seconds" numeric NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "schedule" ADD CONSTRAINT "schedule_team_id_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "team"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "escalation_policy_step" DROP COLUMN IF EXISTS "rotation_id";--> statement-breakpoint
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
 ALTER TABLE "team" ADD CONSTRAINT "team_org_id_org_id_fk" FOREIGN KEY ("org_id") REFERENCES "org"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
