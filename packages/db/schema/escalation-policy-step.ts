import { pgTable, text } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { custom, z } from 'zod';

import {
  customValidators,
  EscalationPolicyId,
  OrgId,
  RotationId,
  ScheduleId,
  UserId,
} from '@vessel/types';

import { escalationPolicy } from './escalation-policy';
import { org } from './org';
import { rotation } from './rotation';
import { schedule } from './schedule';
import { user } from './user';

export const escalationPolicyStep = pgTable('escalation_policy_step', {
  id: text('id').primaryKey(),
  escalationPolicyId: text('escalation_policy_id').references(
    () => escalationPolicy.id,
  ),
  orgId: text('org_id')
    .references(() => org.id)
    .notNull(),
  scheduleId: text('schedule_id').references(() => schedule.id),
  rotationId: text('rotation_id').references(() => rotation.id),
  userId: text('user_id').references(() => user.id),
});

export const selectEscalationPolicyStepSchema = createSelectSchema(
  escalationPolicyStep,
  {
    id: customValidators.escalationPolicyStepId,
    escalationPolicyId: customValidators.escalationPolicyId,
    orgId: customValidators.orgId,
    scheduleId: customValidators.scheduleId,
    rotationId: customValidators.rotationId,
    userId: customValidators.userId,
  },
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
).refine((escalationPolicyStep) => {
  return (
    !(escalationPolicyStep.scheduleId && escalationPolicyStep.rotationId) &&
    !escalationPolicyStep.userId
  );
}, 'Escalation policy step can only have either 1. scheduleId and rotationId or 2. userId');

export type CreateEscalationPolicyStep = Omit<
  z.infer<typeof insertEscalationPolicyStepSchema>,
  'id'
>;
