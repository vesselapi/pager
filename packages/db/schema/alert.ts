import { json, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

import type { AlertId, UserId } from '@vessel/types';
import { APP_ID, AlertIdRegex, UserIdRegex } from '@vessel/types';

import { org } from './org';
import { user } from './user';

const alertSourceEnum = pgEnum('alert_source', [...APP_ID, 'vessel']);
const statusEnum = pgEnum('status', ['ACKED', 'OPEN', 'CLOSED']);

export const alert = pgTable('alert', {
  id: text('id').primaryKey(), // v_alert_[hash]
  orgId: text('org_id')
    .references(() => org.id)
    .notNull(),
  title: text('title').notNull(),
  status: statusEnum('status').default('OPEN').notNull(),
  assignedToId: text('assigned_to_id').references(() => user.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  source: alertSourceEnum('source').notNull(),
  metadata: json('metadata'),
});

export const selectAlertSchema = createSelectSchema(alert, {
  id: (schema) => schema.id.transform((x) => x as AlertId),
  assignedToId: (schema) => schema.id.transform((x) => x as UserId),
});

export const insertAlertSchema = createInsertSchema(alert, {
  id: (schema) =>
    schema.id
      .regex(AlertIdRegex, `Invalid id, expected format ${AlertIdRegex}`)
      .transform((x) => x as AlertId),
  assignedToId: (schema) =>
    schema.id
      .regex(UserIdRegex, `Invalid id, expected format ${UserIdRegex}`)
      .transform((x) => x as UserId),
});

export type Alert = z.infer<typeof selectAlertSchema>;
export type UpsertAlert = Partial<
  Omit<z.infer<typeof insertAlertSchema>, 'id'>
>;
export type CreateAlert = Omit<z.infer<typeof insertAlertSchema>, 'id'>;
