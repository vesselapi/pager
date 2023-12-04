import { pgTable, text } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

import { customValidators } from '@vessel/types';

import { relations } from 'drizzle-orm';
import { alert } from './alert';
import { escalationPolicyStep } from './escalation-policy-step';
import { org } from './org';

export const escalationPolicy = pgTable('escalation_policy', {
  id: text('id').primaryKey(),
  orgId: text('org_id')
    .references(() => org.id)
    .notNull(),
  name: text('name').notNull(),
});

export const escalationPolicyToStepRelation = relations(
  escalationPolicy,
  ({ many }) => ({
    steps: many(escalationPolicyStep),
  }),
);

export const escalationPolicyToAlertRelation = relations(
  escalationPolicy,
  ({ many }) => ({
    alerts: many(alert),
  }),
);

export const selectEscalationPolicySchema = createSelectSchema(
  escalationPolicy,
  {
    id: customValidators.escalationPolicyId,
    orgId: customValidators.orgId,
  },
);

export const insertEscalationPolicySchema = createInsertSchema(
  escalationPolicy,
  {
    id: customValidators.escalationPolicyId,
    orgId: customValidators.orgId,
  },
);

export type EscalationPolicy = z.infer<typeof selectEscalationPolicySchema>;
export type CreateEscalationPolicy = Omit<
  z.infer<typeof insertEscalationPolicySchema>,
  'id'
>;
