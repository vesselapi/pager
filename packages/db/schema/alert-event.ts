import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import { customValidators } from '@vessel/types';

import type { z } from 'zod';
import { alert } from './alert';

/**
 * TODO: Implement Alert Event Relations
 *
 * @about An Audit Log of all events that happen to an alert.
 */
export const alertEvent = pgTable('alert_event', {
  id: text('id').primaryKey(), // v_alertEvent_[hash]
  alertId: text('id').references(() => alert.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  message: text('message'),
});

export const selectAlertEventSchema = createSelectSchema(alertEvent, {
  id: customValidators.alertEventId,
  alertId: customValidators.alertId,
});

export const insertAlertEventSchema = createInsertSchema(alertEvent, {
  id: customValidators.alertEventId,
  alertId: customValidators.alertId,
});

export type CreateAlertEvent = Omit<
  z.infer<typeof insertAlertEventSchema>,
  'id'
>;
