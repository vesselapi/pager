import { numeric, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

import type {
  OrgId,
  RotationId,
  ScheduleId} from '@vessel/types';
import {
  OrgIdRegex,
  RotationIdRegex,
  ScheduleIdRegex,
} from '@vessel/types';

import { org } from './org';
import { schedule } from './schedule';

export const rotation = pgTable('rotation', {
  id: text('id').primaryKey(),
  orgId: text('org_id')
    .references(() => org.id)
    .notNull(),
  scheduleId: text('schedule_id')
    .references(() => schedule.id)
    .notNull(),
  startTime: timestamp('start_time').notNull(),
  lengthInSeconds: numeric('length_in_seconds').notNull(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const selectRotationSchema = createSelectSchema(rotation, {
  id: (schema) => schema.id.transform((x) => x as RotationId),
  orgId: (schema) => schema.orgId.transform((x) => x as OrgId),
  scheduleId: (schema) => schema.orgId.transform((x) => x as ScheduleId),
});

export const insertRotationSchema = createInsertSchema(rotation, {
  id: (schema) =>
    schema.id
      .regex(RotationIdRegex, `Invalid id, expected format ${RotationIdRegex}`)
      .transform((x) => x as RotationId),
  orgId: (schema) =>
    schema.orgId
      .regex(OrgIdRegex, `Invalid id, expected format ${OrgIdRegex}`)
      .transform((x) => x as OrgId),
  scheduleId: (schema) =>
    schema.id
      .regex(ScheduleIdRegex, `Invalid id, expected format ${ScheduleIdRegex}`)
      .transform((x) => x as ScheduleId),
});
export type CreateRotation = Omit<z.infer<typeof insertRotationSchema>, 'id'>;
