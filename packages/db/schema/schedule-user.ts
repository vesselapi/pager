import {
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import {
  OrgId,
  OrgIdRegex,
  ScheduleId,
  ScheduleIdRegex,
  ScheduleUserId,
  ScheduleUserIdRegex,
  UserId,
} from '@vessel/types';

import { org } from './org';
import { schedule } from './schedule';
import { user } from './user';

export const scheduleUser = pgTable('schedule_user', {
  id: text('id').primaryKey(),
  order: integer('order').notNull(),
  orgId: text('org_id')
    .references(() => org.id)
    .notNull(),
  scheduleId: text('schedule_id')
    .references(() => schedule.id)
    .notNull(),
  userId: text('user_id')
    .references(() => user.id)
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const selectScheduleUser = createSelectSchema(scheduleUser, {
  id: (schema) => schema.id.transform((x) => x as ScheduleUserId),
  orgId: (schema) => schema.orgId.transform((x) => x as OrgId),
  scheduleId: (schema) => schema.id.transform((x) => x as ScheduleId),
  userId: (schema) => schema.id.transform((x) => x as UserId),
});

export const insertScheduleUserSchema = createInsertSchema(scheduleUser, {
  id: (schema) =>
    schema.id
      .regex(
        ScheduleUserIdRegex,
        `Invalid id, expected format ${ScheduleUserIdRegex}`,
      )
      .transform((x) => x as ScheduleUserId),
  orgId: (schema) =>
    schema.orgId
      .regex(OrgIdRegex, `Invalid id, expected format ${OrgIdRegex}`)
      .transform((x) => x as OrgId),
  scheduleId: (schema) =>
    schema.id
      .regex(ScheduleIdRegex, `Invalid id, expected format ${ScheduleIdRegex}`)
      .transform((x) => x as ScheduleId),
});

export type CreateScheduleUser = Omit<
  z.infer<typeof insertScheduleUserSchema>,
  'id'
>;
