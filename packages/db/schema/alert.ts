import { json, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { user } from './user';

export const alert = pgTable('alert', {
  id: text('id').primaryKey(), // v.alert.[hash]
  title: text('title'),
  status: text('status', { enum: ['acked', 'open', 'closed'] })
    .default('open')
    .notNull(),
  assignedToId: text('assignedToId').references(() => user.id),
  createdTime: timestamp('created_at').notNull(),
  metadata: json('metadata'),
});
