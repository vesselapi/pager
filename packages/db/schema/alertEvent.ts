import { foreignKey, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

import { alert } from './alert';

export const alertEvent = pgTable('alert-event', {
  id: text('id').primaryKey(), // v_alert-event_[hash]
  alertId: text('id').references(() => alert.id),
  createdAt: timestamp('created_at').notNull(),
  message: text('message'),
});
