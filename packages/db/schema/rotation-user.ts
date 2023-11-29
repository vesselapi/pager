import { integer, pgTable, text } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import {
  OrgId,
  OrgIdRegex,
  RotationId,
  RotationIdRegex,
  RotationUserId,
  RotationUserIdRegex,
  UserId,
} from '@vessel/types';

import { org } from './org';
import { schedule } from './schedule';
import { user } from './user';

export const rotationUser = pgTable('rotation_user', {
  id: text('id').primaryKey(),
  order: integer('order').notNull(),
  orgId: text('org_id')
    .references(() => org.id)
    .notNull(),
  rotationId: text('rotation_id')
    .references(() => schedule.id)
    .notNull(),
  userId: text('user_id')
    .references(() => user.id)
    .notNull(),
});

export const selectRotationUserSchema = createSelectSchema(rotationUser, {
  id: (schema) => schema.id.transform((x) => x as RotationUserId),
  orgId: (schema) => schema.orgId.transform((x) => x as OrgId),
  rotationId: (schema) => schema.id.transform((x) => x as RotationId),
  userId: (schema) => schema.id.transform((x) => x as UserId),
});

export const insertRotationUserSchema = createInsertSchema(rotationUser, {
  id: (schema) =>
    schema.id
      .regex(
        RotationUserIdRegex,
        `Invalid id, expected format ${RotationUserIdRegex}`,
      )
      .transform((x) => x as RotationUserId),
  orgId: (schema) =>
    schema.orgId
      .regex(OrgIdRegex, `Invalid id, expected format ${OrgIdRegex}`)
      .transform((x) => x as OrgId),
  rotationId: (schema) =>
    schema.id
      .regex(RotationIdRegex, `Invalid id, expected format ${RotationIdRegex}`)
      .transform((x) => x as RotationId),
});

export type CreateRotationUser = Omit<
  z.infer<typeof insertRotationUserSchema>,
  'id'
>;
