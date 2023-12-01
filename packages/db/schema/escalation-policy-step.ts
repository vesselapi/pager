import { numeric, pgEnum, pgTable, text } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { customValidators } from '@vessel/types';

import { escalationPolicy } from './escalation-policy';
import { org } from './org';
import { schedule } from './schedule';

import { user } from './user';

export const escalationPolicyStepTypeEnum = pgEnum(
  'escalation_policy_step_type',
  ['SCHEDULE', 'USER'],
);

export const escalationPolicyStep = pgTable('escalation_policy_step', {
  id: text('id').primaryKey(),
  orgId: text('org_id')
    .references(() => org.id)
    .notNull(),
  type: escalationPolicyStepTypeEnum('type').notNull(),
  escalationPolicyId: text('escalation_policy_id')
    .references(() => escalationPolicy.id)
    .notNull(),

  nextStepInSeconds: numeric('next_step_in_seconds').notNull(),
  scheduleId: text('schedule_id').references(() => schedule.id),
  userId: text('user_id').references(() => user.id),
});

export const selectEscalationPolicyStepSchema = createSelectSchema(
  escalationPolicyStep,
  {
    id: customValidators.escalationPolicyStepId,
    escalationPolicyId: customValidators.escalationPolicyId,
    orgId: customValidators.orgId,
    scheduleId: customValidators.teamId,
    userId: customValidators.userId,
  },
);

export const insertEscalationPolicyStepSchema = createInsertSchema(
  escalationPolicyStep,
  {
    id: customValidators.escalationPolicyStepId,
    escalationPolicyId: customValidators.escalationPolicyId,
    orgId: customValidators.orgId,
    scheduleId: customValidators.teamId,
    userId: customValidators.userId,
  },
).refine((escalationPolicyStep) => {
  return !escalationPolicyStep.scheduleId;
}, 'Escalation policy step can only have either 1. scheduleId and rotationId or 2. userId');

export type CreateEscalationPolicyStep = Omit<
  z.infer<typeof insertEscalationPolicyStepSchema>,
  'id'
>;
