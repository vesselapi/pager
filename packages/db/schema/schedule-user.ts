import { integer, pgTable, text } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

import { customValidators } from '@vessel/types';

import { relations } from 'drizzle-orm';
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
});

export const scheduleUserToScheduleRelation = relations(
  scheduleUser,
  ({ one }) => ({
    schedule: one(schedule, {
      fields: [scheduleUser.scheduleId],
      references: [schedule.id],
    }),
  }),
);

export const scheduleUserToUserRelation = relations(
  scheduleUser,
  ({ one }) => ({
    user: one(user, {
      fields: [scheduleUser.userId],
      references: [user.id],
    }),
  }),
);

export const selectScheduleUserSchema = createSelectSchema(scheduleUser, {
  id: customValidators.scheduleUserId,
  orgId: customValidators.orgId,
  scheduleId: customValidators.scheduleId,
  userId: customValidators.userId,
});

export const insertScheduleUserSchema = createInsertSchema(scheduleUser, {
  id: customValidators.scheduleUserId,
  orgId: customValidators.orgId,
  scheduleId: customValidators.scheduleId,
  userId: customValidators.userId,
});

export type CreateScheduleUser = Omit<
  z.infer<typeof insertScheduleUserSchema>,
  'id'
>;
