import { pgTable, text } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { customValidators } from '@vessel/types';

import { org } from './org';

export const escalationPolicy = pgTable('escalation_policy', {
  id: text('id').primaryKey(),
  orgId: text('org_id')
    .references(() => org.id)
    .notNull(),
  name: text('name').notNull(),
});

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

export type CreateEscalationPolicy = Omit<
  z.infer<typeof insertEscalationPolicySchema>,
  'id'
>;
