import { json, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { user } from './user';

export const alert = pgTable('alert', {
  id: text('id').primaryKey(), // v.alert.[hash]
  title: text('title'),
  status: text('status', { enum: ['ACKED', 'OPEN', 'CLOSED'] })
    .default('OPEN')
    .notNull(),
  assignedToId: text('assigned_to_id').references(() => user.id),
  createdAt: timestamp('created_at').notNull(),
  metadata: json('metadata'),
});
