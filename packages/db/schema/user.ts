import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

import type { OrgId, UserId } from '@vessel/types';
import { OrgIdRegex, UserIdRegex } from '@vessel/types';

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
});

export const selectUserSchema = createSelectSchema(user, {
  id: (schema) => schema.id.transform((x) => x as UserId),
  orgId: (schema) => schema.orgId.transform((x) => x as OrgId),
});

export const insertUserSchema = createInsertSchema(user, {
  id: (schema) =>
    schema.id
      .regex(UserIdRegex, `Invalid id, expected format ${UserIdRegex}`)
      .transform((x) => x as UserId),
  orgId: (schema) =>
    schema.id
      .regex(OrgIdRegex, `Invalid id, expected format ${OrgIdRegex}`)
      .transform((x) => x as OrgId),
});

export type CreateUser = Omit<z.infer<typeof insertUserSchema>, 'id'>;
