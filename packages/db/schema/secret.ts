import { sql } from 'drizzle-orm';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const secret = pgTable('secret', {
  id: text('id').primaryKey(), // v_organization_[hash]
  iv: text('iv').notNull(),
  encryptedData: text('encrypted_data').notNull(),
  createdAt: timestamp('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
