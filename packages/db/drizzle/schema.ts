import { sql } from 'drizzle-orm';
import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

export const t3TurboPost = pgTable('t3turbo_post', {
  id: serial('id').primaryKey().notNull(),
  name: varchar('name', { length: 256 }).notNull(),
  content: varchar('content', { length: 256 }).notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'string' }),
});
