import {
  foreignKey,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

import { alert } from './alert';

export const alertEvent = pgTable(
  'alert-event',
  {
    id: uuid('id').primaryKey(),
    alertId: uuid('alert_id'),
    createdAt: timestamp('created_at').notNull(),
    message: text('message'),
  },
  (table) => {
    return {
      userReference: foreignKey({
        columns: [table.alertId],
        foreignColumns: [alert.id],
      }),
    };
  },
);
