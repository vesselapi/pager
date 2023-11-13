import { sql } from 'drizzle-orm';
import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
  id: text('id').primaryKey(), // v.user.[hash]
  email: varchar('email', { length: 256 }).unique(),
  firstName: varchar('first_name', { length: 256 }),
  lastName: varchar('last_name', { length: 256 }),
  createdTime: timestamp('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
