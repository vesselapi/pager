ALTER TABLE "alert-event" RENAME TO "alert_event";--> statement-breakpoint
ALTER TABLE "alert_event" DROP CONSTRAINT "alert-event_id_alert_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "alert_event" ADD CONSTRAINT "alert_event_id_alert_id_fk" FOREIGN KEY ("id") REFERENCES "alert"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
