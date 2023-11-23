import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { UserIdRegex } from '@vessel/types';
import type { OrgId, UserId } from '@vessel/types';

import { organization } from './organization';

export const user = pgTable('user', {
  id: text('id').primaryKey(), // v_user_[hash]
  email: text('email').unique().notNull(),
  organizationId: text('organization_id')
    .references(() => organization.id)
    .notNull(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const selectUserSchema = createSelectSchema(user, {
  id: (schema) => schema.id.transform((x) => x as UserId),
  organizationId: (schema) =>
    schema.organizationId.transform((x) => x as OrgId),
});

export const insertUserSchema = createInsertSchema(user, {
  id: (schema) =>
    schema.id.regex(UserIdRegex, `Invalid id, expected format ${UserIdRegex}`),
  organizationId: (schema) =>
    schema.organizationId.transform((x) => x as OrgId),
});

export type CreateUser = z.infer<typeof insertUserSchema>;
