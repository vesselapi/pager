import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import { customValidators } from '@vessel/types';

import { org } from './org';
import { user } from './user';

export const secret = pgTable('secret', {
  id: text('id').primaryKey(),
  iv: text('iv').notNull(),
  orgId: text('org_id').references(() => org.id),
  userId: text('user_id').references(() => user.id),
  encryptedData: text('encrypted_data').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const selectSecretSchema = createSelectSchema(secret, {
  id: customValidators.secretId,
  orgId: customValidators.orgId,
  userId: customValidators.userId,
});

export const insertSecretSchema = createInsertSchema(secret, {
  id: customValidators.secretId,
  orgId: customValidators.orgId,
  userId: customValidators.userId,
});
