import { numeric, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

import { customValidators } from '@vessel/types';

import { relations } from 'drizzle-orm';
import { org } from './org';
import { scheduleUser } from './schedule-user';
import { team } from './team';

export const schedule = pgTable('schedule', {
  id: text('id').primaryKey(),
  orgId: text('org_id')
    .references(() => org.id)
    .notNull(),
  teamId: text('team_id')
    .references(() => team.id)
    .notNull(),
  startTime: timestamp('start_time').notNull(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  lengthInSeconds: numeric('length_in_seconds').notNull(),
});

export const scheduleToScheduleUserRelation = relations(
  schedule,
  ({ many }) => ({ scheduleUsers: many(scheduleUser) }),
);

export const scheduleToTeamRelation = relations(schedule, ({ one }) => ({
  team: one(team, {
    fields: [schedule.teamId],
    references: [team.id],
  }),
}));

export const selectScheduleSchema = createSelectSchema(schedule, {
  id: customValidators.scheduleId,
  orgId: customValidators.orgId,
  teamId: customValidators.teamId,
});

export const insertScheduleSchema = createInsertSchema(schedule, {
  id: customValidators.scheduleId,
  orgId: customValidators.orgId,
  teamId: customValidators.teamId,
});
export type Schedule = z.infer<typeof selectScheduleSchema>;
export type CreateSchedule = Omit<z.infer<typeof insertScheduleSchema>, 'id'>;
