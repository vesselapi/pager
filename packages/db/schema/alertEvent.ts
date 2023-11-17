import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import { AlertEventIdRegex, AlertIdRegex } from '@vessel/types';
import type { AlertEventId, AlertId } from '@vessel/types';

import { alert } from './alert';

export const alertEvent = pgTable('alert_event', {
  id: text('id').primaryKey(), // v_alert_event_[hash]
  alertId: text('id').references(() => alert.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  message: text('message'),
});

export const selectAlertEventSchema = createSelectSchema(alertEvent, {
  id: (schema) => schema.id.transform((x) => x as AlertEventId),
  alertId: (schema) => schema.id.transform((x) => x as AlertId),
});

export const insertAlertEventSchema = createInsertSchema(alertEvent, {
  id: (schema) =>
    schema.id.regex(
      AlertEventIdRegex,
      `Invalid id, expected format ${AlertEventIdRegex}`,
    ),
  alertId: (schema) =>
    schema.id.regex(
      AlertIdRegex,
      `Invalid id, expected format ${AlertIdRegex}`,
    ),
});
