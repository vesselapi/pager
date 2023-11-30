CREATE TABLE IF NOT EXISTS "escalation_policy_step" (
	"id" text PRIMARY KEY NOT NULL,
	"escalation_policy_id" text NOT NULL,
	"org_id" text NOT NULL,
	"next_step_in_seconds" numeric NOT NULL,
	"schedule_id" text,
	"rotation_id" text,
	"user_id" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "escalation_policy" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "alert" ADD COLUMN "escalation_policy_id" text;--> statement-breakpoint
ALTER TABLE "integration" ADD COLUMN "escalation_policy_id" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "alert" ADD CONSTRAINT "alert_escalation_policy_id_escalation_policy_id_fk" FOREIGN KEY ("escalation_policy_id") REFERENCES "escalation_policy"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "integration" ADD CONSTRAINT "integration_escalation_policy_id_escalation_policy_id_fk" FOREIGN KEY ("escalation_policy_id") REFERENCES "escalation_policy"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "escalation_policy_step" ADD CONSTRAINT "escalation_policy_step_escalation_policy_id_escalation_policy_id_fk" FOREIGN KEY ("escalation_policy_id") REFERENCES "escalation_policy"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "escalation_policy_step" ADD CONSTRAINT "escalation_policy_step_org_id_org_id_fk" FOREIGN KEY ("org_id") REFERENCES "org"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "escalation_policy_step" ADD CONSTRAINT "escalation_policy_step_schedule_id_schedule_id_fk" FOREIGN KEY ("schedule_id") REFERENCES "schedule"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "escalation_policy_step" ADD CONSTRAINT "escalation_policy_step_rotation_id_rotation_id_fk" FOREIGN KEY ("rotation_id") REFERENCES "rotation"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "escalation_policy_step" ADD CONSTRAINT "escalation_policy_step_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "escalation_policy" ADD CONSTRAINT "escalation_policy_org_id_org_id_fk" FOREIGN KEY ("org_id") REFERENCES "org"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
