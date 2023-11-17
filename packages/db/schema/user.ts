import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import { UserIdRegex } from '../../types';
import type { UserId } from '../../types';
import { organization } from './organization';

export const user = pgTable('user', {
  id: text('id').primaryKey(), // v_user_[hash]
  email: text('email').unique(),
  organizationId: text('organization_id').references(() => organization.id),
  firstName: text('first_name'),
  lastName: text('last_name'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const selectUserSchema = createSelectSchema(user, {
  id: (schema) => schema.id.transform((x) => x as UserId),
});

export const insertUserSchema = createInsertSchema(user, {
  id: (schema) =>
    schema.id.regex(UserIdRegex, `Invalid id, expected format ${UserIdRegex}`),
});
