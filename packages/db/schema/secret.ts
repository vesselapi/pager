import { sql } from 'drizzle-orm';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import { OrgId, SecretId, SecretIdRegex } from '@vessel/types';

import { organization } from './organization';

export const secret = pgTable('secret', {
  id: text('id').primaryKey(),
  iv: text('iv').notNull(),
  orgId: text('org_id').references(() => organization.id),
  encryptedData: text('encrypted_data').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const selectSecretSchema = createSelectSchema(secret, {
  id: (schema) => schema.id.transform((x) => x as SecretId),
  orgId: (schema) => schema.orgId.transform((x) => x as OrgId),
});

export const insertSecretSchema = createInsertSchema(secret, {
  id: (schema) =>
    schema.id.regex(
      SecretIdRegex,
      `Invalid id, expected format ${SecretIdRegex}`,
    ),
});
