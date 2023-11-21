import { sql } from 'drizzle-orm';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import type { SecretId} from '@vessel/types';
import { SecretIdRegex } from '@vessel/types';

export const secret = pgTable('secret', {
  id: text('id').primaryKey(),
  iv: text('iv').notNull(),
  encryptedData: text('encrypted_data').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const selectSecretSchema = createSelectSchema(secret, {
  id: (schema) => schema.id.transform((x) => x as SecretId),
});

export const insertSecretSchema = createInsertSchema(secret, {
  id: (schema) =>
    schema.id.regex(
      SecretIdRegex,
      `Invalid id, expected format ${SecretIdRegex}`,
    ),
});
