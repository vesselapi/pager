import { integer, pgEnum, pgTable, text } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import {
  RotationId,
  ScheduleId,
  UserId,
  customValidators,
} from '@vessel/types';

import { escalationPolicy } from './escalation-policy';
import { org } from './org';
import { rotation } from './rotation';
import { schedule } from './schedule';
import { user } from './user';

export const escalationPolicyStepType = pgEnum('escalation_policy_step_type', [
  'USER',
  'ROTATION',
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
  rotationId: text('rotation_id').references(() => rotation.id),
  userId: text('user_id').references(() => user.id),
});

const selectSchema = createSelectSchema(escalationPolicyStep, {
  id: customValidators.escalationPolicyStepId,
  escalationPolicyId: customValidators.escalationPolicyId,
  orgId: customValidators.orgId,
  scheduleId: customValidators.scheduleId,
  rotationId: customValidators.rotationId,
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
    rotationId: customValidators.rotationId,
    userId: customValidators.userId,
  },
)
  .refine((escalationPolicyStep) => {
    return (
      !(escalationPolicyStep.scheduleId && escalationPolicyStep.rotationId) &&
      !escalationPolicyStep.userId
    );
  }, 'Escalation policy step can only have either 1. scheduleId and rotationId or 2. userId')
  .transform((x) => x as EscalationPolicyStep);

export type BaseEscalationPolicyStep = z.infer<typeof selectSchema>;

export type EscalationPolicyUserStep = BaseEscalationPolicyStep & {
  type: 'USER';
  userId: UserId;
  rotationId: null;
  scheduleId: null;
};

export type EscalationPolicyRotationStep = BaseEscalationPolicyStep & {
  type: 'ROTATION';
  userId: null;
  rotationId: RotationId;
  scheduleId: ScheduleId;
};

export type EscalationPolicyStep =
  | EscalationPolicyUserStep
  | EscalationPolicyRotationStep;

export type CreateEscalationPolicyStep = Omit<
  z.infer<typeof insertEscalationPolicyStepSchema>,
  'id'
>;
