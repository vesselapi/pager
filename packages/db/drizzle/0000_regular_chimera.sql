CREATE TABLE IF NOT EXISTS "alert" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"title" text NOT NULL,
	"status" text DEFAULT 'OPEN' NOT NULL,
	"assigned_to_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"metadata" json
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "alert_event" (
	"id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"message" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "integration" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"app_id" text NOT NULL,
	"secret_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "org" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rotation_user" (
	"id" text PRIMARY KEY NOT NULL,
	"order" integer NOT NULL,
	"org_id" text NOT NULL,
	"rotation_id" text NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
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
CREATE TABLE IF NOT EXISTS "schedule" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "secret" (
	"id" text PRIMARY KEY NOT NULL,
	"iv" text NOT NULL,
	"org_id" text,
	"encrypted_data" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"org_id" text NOT NULL,
	"first_name" text,
	"last_name" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "alert" ADD CONSTRAINT "alert_org_id_org_id_fk" FOREIGN KEY ("org_id") REFERENCES "org"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
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
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "integration" ADD CONSTRAINT "integration_org_id_org_id_fk" FOREIGN KEY ("org_id") REFERENCES "org"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "integration" ADD CONSTRAINT "integration_secret_id_secret_id_fk" FOREIGN KEY ("secret_id") REFERENCES "secret"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
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
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "schedule" ADD CONSTRAINT "schedule_org_id_org_id_fk" FOREIGN KEY ("org_id") REFERENCES "org"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "secret" ADD CONSTRAINT "secret_org_id_org_id_fk" FOREIGN KEY ("org_id") REFERENCES "org"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user" ADD CONSTRAINT "user_org_id_org_id_fk" FOREIGN KEY ("org_id") REFERENCES "org"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
