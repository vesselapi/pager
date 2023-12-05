import { integer, pgEnum, pgTable, text } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

import type { ScheduleId, UserId } from '@vessel/types';
import { customValidators } from '@vessel/types';

import { escalationPolicy } from './escalation-policy';
import { org } from './org';
import { schedule } from './schedule';

import { relations } from 'drizzle-orm';
import { user } from './user';

export const escalationPolicyStepType = pgEnum('escalation_policy_step_type', [
  'USER',
  'SCHEDULE',
]);

export const escalationPolicyStep = pgTable('escalation_policy_step', {
  id: text('id').primaryKey(),
  type: escalationPolicyStepType('type').notNull(),
  escalationPolicyId: text('escalation_policy_id')
    .references(() => escalationPolicy.id)
    .notNull(),
  order: integer('order').notNull(),
  orgId: text('org_id')
    .references(() => org.id)
    .notNull(),
  nextStepInSeconds: integer('next_step_in_seconds').notNull(),
  scheduleId: text('schedule_id').references(() => schedule.id),
  userId: text('user_id').references(() => user.id),
});

export const stepToEscalationPolicyRelation = relations(
  escalationPolicyStep,
  ({ one }) => ({
    escalationPolicy: one(escalationPolicy, {
      fields: [escalationPolicyStep.escalationPolicyId],
      references: [escalationPolicy.id],
    }),
  }),
);

const selectSchema = createSelectSchema(escalationPolicyStep, {
  id: customValidators.escalationPolicyStepId,
  escalationPolicyId: customValidators.escalationPolicyId,
  orgId: customValidators.orgId,
  scheduleId: customValidators.scheduleId,
  userId: customValidators.userId,
});

export const selectEscalationPolicyStepSchema = selectSchema.transform(
  (x) => x as EscalationPolicyStep,
);

export const insertEscalationPolicyStepSchema = createInsertSchema(
  escalationPolicyStep,
  {
    id: customValidators.escalationPolicyStepId,
    escalationPolicyId: customValidators.escalationPolicyId,
    orgId: customValidators.orgId,
    scheduleId: customValidators.scheduleId,
    userId: customValidators.userId,
  },
).transform((x) => x as EscalationPolicyStep);

export type BaseEscalationPolicyStep = z.infer<typeof selectSchema>;

export type EscalationPolicyUserStep = BaseEscalationPolicyStep & {
  type: 'USER';
  userId: UserId;
  scheduleId: null;
};

export type EscalationPolicyScheduleStep = BaseEscalationPolicyStep & {
  type: 'SCHEDULE';
  userId: null;
  scheduleId: ScheduleId;
};

export type EscalationPolicyStep =
  | EscalationPolicyUserStep
  | EscalationPolicyScheduleStep;

export type CreateEscalationPolicyStep = Omit<
  z.infer<typeof insertEscalationPolicyStepSchema>,
  'id'
>;
