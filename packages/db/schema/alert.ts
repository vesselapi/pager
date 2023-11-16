import { json, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import { user } from './user';

export const alert = pgTable('alert', {
  id: text('id').primaryKey(), // v_alert_[hash]
  title: text('title'),
  status: text('status', { enum: ['ACKED', 'OPEN', 'CLOSED'] })
    .default('OPEN')
    .notNull(),
  assignedToId: text('assigned_to_id').references(() => user.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  metadata: json('metadata'),
});

export type AlertId = `v_alert_${string}`;
const AlertIdRegex = /^v_alert_[a-z0-9]+$/;

export const selectAlertSchema = createSelectSchema(alert, {
  id: (schema) => schema.id.transform((x) => x as AlertId),
  // Do we need validation on `assignedToId`?
});

export const insertAlertSchema = createInsertSchema(alert, {
  id: (schema) =>
    schema.id
      .regex(AlertIdRegex, `Invalid id, expected format ${AlertIdRegex}`)
      .transform((x) => x as AlertId),
});
