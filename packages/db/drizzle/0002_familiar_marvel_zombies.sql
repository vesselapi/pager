ALTER TABLE "alert_event" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "secret" ADD COLUMN "organization_id" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "secret" ADD CONSTRAINT "secret_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
