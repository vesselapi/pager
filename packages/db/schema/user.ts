import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

import { customValidators } from '@vessel/types';

import { org } from './org';

export const user = pgTable('user', {
  id: text('id').primaryKey(), // v_user_[hash]
  email: text('email').unique().notNull(),
  orgId: text('org_id')
    .references(() => org.id)
    .notNull(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  expoPushTokenSecretId: text('expo_push_token_secret_id'),
  externalId: text('external_id').notNull(),
  imageS3Key: text('image_s3_key'),
});

export const selectUserSchema = createSelectSchema(user, {
  id: customValidators.userId,
  orgId: customValidators.orgId,
  expoPushTokenSecretId: customValidators.secretExpoPushTokenId,
});

export const insertUserSchema = createInsertSchema(user, {
  id: customValidators.userId,
  orgId: customValidators.orgId,
  expoPushTokenSecretId: customValidators.secretExpoPushTokenId,
});

export type User = z.infer<typeof selectUserSchema>;
export type CreateUser = z.infer<typeof insertUserSchema>;
