import { sql } from 'drizzle-orm';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const organization = pgTable('organization', {
  id: text('id').primaryKey(), // v_organization_[hash]
  name: text('name'),
  createdAt: timestamp('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
