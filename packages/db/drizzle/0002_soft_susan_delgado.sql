DO $$ BEGIN
 CREATE TYPE "escalation_policy_step_type" AS ENUM('USER', 'ROTATION');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "escalation_policy_step" ALTER COLUMN "next_step_in_seconds" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "alert" ADD COLUMN "escalation_step_state" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "escalation_policy_step" ADD COLUMN "type" "escalation_policy_step_type";--> statement-breakpoint
ALTER TABLE "escalation_policy_step" ADD COLUMN "order" integer NOT NULL;