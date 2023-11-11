import { json, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const alert = pgTable('alert', {
  id: uuid('id').primaryKey(),
  title: text('title'),
  createdAt: timestamp('created_at').notNull(),
  metadata: json('metadata'),
});
