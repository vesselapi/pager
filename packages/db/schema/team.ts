import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

import { customValidators } from '@vessel/types';

import { relations } from 'drizzle-orm';
import { org } from './org';
import { schedule } from './schedule';

export const team = pgTable('team', {
  id: text('id').primaryKey(),
  orgId: text('org_id')
    .references(() => org.id)
    .notNull(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const teamScheduleRelation = relations(team, ({ many }) => {
  return {
    schedules: many(schedule),
  };
});

export const selectTeamSchema = createSelectSchema(team, {
  id: customValidators.teamId,
  orgId: customValidators.orgId,
});

export const insertTeamSchema = createInsertSchema(team, {
  id: customValidators.teamId,
  orgId: customValidators.orgId,
});
export type CreateTeam = Omit<z.infer<typeof insertTeamSchema>, 'id'>;
