import { json, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { z } from 'zod';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import type { AlertId, UserId } from '@vessel/types';
import { AlertIdRegex, UserIdRegex } from '@vessel/types';

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

export type Alert = z.infer<typeof selectAlertSchema>;

export const selectAlertSchema = createSelectSchema(alert, {
  id: (schema) => schema.id.transform((x) => x as AlertId),
  assignedToId: (schema) => schema.id.transform((x) => x as UserId),
});

export const insertAlertSchema = createInsertSchema(alert, {
  id: (schema) =>
    schema.id.regex(
      AlertIdRegex,
      `Invalid id, expected format ${AlertIdRegex}`,
    ),
  assignedToId: (schema) =>
    schema.id.regex(UserIdRegex, `Invalid id, expected format ${UserIdRegex}`),
});
