CREATE TABLE IF NOT EXISTS "alert" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text,
	"status" text DEFAULT 'OPEN' NOT NULL,
	"assigned_to_id" text,
	"created_at" timestamp NOT NULL,
	"metadata" json
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "alert_event" (
	"id" text,
	"created_at" timestamp NOT NULL,
	"message" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "organization" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text,
	"organization_id" text,
	"first_name" text,
	"last_name" text,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "alert" ADD CONSTRAINT "alert_assigned_to_id_user_id_fk" FOREIGN KEY ("assigned_to_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "alert_event" ADD CONSTRAINT "alert_event_id_alert_id_fk" FOREIGN KEY ("id") REFERENCES "alert"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
