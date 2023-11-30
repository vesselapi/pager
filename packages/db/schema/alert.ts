import {
  integer,
  json,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

import { APP_ID, customValidators } from '@vessel/types';

import { relations } from 'drizzle-orm';

import { escalationPolicy } from './escalation-policy';
import { org } from './org';
import { user } from './user';

export const alertSourceEnum = pgEnum('alert_source', [...APP_ID, 'API']);
export const statusEnum = pgEnum('status', ['ACKED', 'OPEN', 'CLOSED']);

export const alert = pgTable('alert', {
  id: text('id').primaryKey(), // v_alert_[hash]
  orgId: text('org_id')
    .references(() => org.id)
    .notNull(),
  title: text('title').notNull(),
  status: statusEnum('status').notNull(),
  assignedToId: text('assigned_to_id').references(() => user.id),
  escalationPolicyId: text('escalation_policy_id').references(
    () => escalationPolicy.id,
  ),
  escalationStepState: integer('escalation_step_state').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  source: alertSourceEnum('source').notNull(),
  metadata: json('metadata'),
});

export const alertEscalationPolicyRelation = relations(alert, ({ one }) => ({
  escalationPolicy: one(escalationPolicy),
}));

export const selectAlertSchema = createSelectSchema(alert, {
  id: customValidators.alertId,
  assignedToId: customValidators.userId,
  escalationPolicyId: customValidators.escalationPolicyId,
});

export const insertAlertSchema = createInsertSchema(alert, {
  id: customValidators.alertId,
  assignedToId: customValidators.userId,
  escalationPolicyId: customValidators.escalationPolicyId,
});

export type Alert = z.infer<typeof selectAlertSchema>;
export type UpsertAlert = Partial<
  Omit<z.infer<typeof insertAlertSchema>, 'id'>
>;
export type CreateAlert = Omit<z.infer<typeof insertAlertSchema>, 'id'>;
