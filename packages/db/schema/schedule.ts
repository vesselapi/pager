import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

import type { OrgId, ScheduleId } from '@vessel/types';
import { OrgIdRegex, ScheduleIdRegex } from '@vessel/types';

import { org } from './org';

export const schedule = pgTable('schedule', {
  id: text('id').primaryKey(),
  orgId: text('org_id')
    .references(() => org.id)
    .notNull(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const selectScheduleSchema = createSelectSchema(schedule, {
  id: (schema) => schema.id.transform((x) => x as ScheduleId),
  orgId: (schema) => schema.orgId.transform((x) => x as OrgId),
});

export const insertScheduleSchema = createInsertSchema(schedule, {
  id: (schema) =>
    schema.id
      .regex(ScheduleIdRegex, `Invalid id, expected format ${ScheduleIdRegex}`)
      .transform((x) => x as ScheduleId),
  orgId: (schema) =>
    schema.orgId
      .regex(OrgIdRegex, `Invalid id, expected format ${OrgIdRegex}`)
      .transform((x) => x as OrgId),
});
export type CreateSchedule = Omit<z.infer<typeof insertScheduleSchema>, 'id'>;
