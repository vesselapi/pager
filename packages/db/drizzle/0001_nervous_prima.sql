ALTER TABLE "integration" ADD COLUMN "secret_id" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "integration" ADD CONSTRAINT "integration_secret_id_secret_id_fk" FOREIGN KEY ("secret_id") REFERENCES "secret"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
