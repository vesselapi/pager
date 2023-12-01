import { numeric, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

import { customValidators } from '@vessel/types';

import { org } from './org';
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
  lengthInSeconds: numeric('length_in_seconds').notNull(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

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
export type CreateSchedule = Omit<z.infer<typeof insertScheduleSchema>, 'id'>;
