import { pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

import { APP_ID, customValidators } from '@vessel/types';

import { escalationPolicy } from './escalation-policy';
import { org } from './org';
import { secret } from './secret';

export const appIdEnum = pgEnum('app_id', APP_ID);

export const integration = pgTable('integration', {
  id: text('id').primaryKey(),
  orgId: text('org_id')
    .references(() => org.id)
    .notNull(),
  appId: appIdEnum('app_id').notNull(),
  secretId: text('secret_id')
    .references(() => secret.id)
    .notNull(),
  externalId: text('external_id'),
  escalationPolicyId: text('escalation_policy_id').references(
    () => escalationPolicy.id,
  ),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const selectIntegrationSchema = createSelectSchema(integration, {
  id: customValidators.integrationId,
  orgId: customValidators.orgId,
  secretId: customValidators.secretIntegrationId,
});

export const insertIntegrationSchema = createInsertSchema(integration, {
  id: customValidators.integrationId,
  orgId: customValidators.orgId,
  secretId: customValidators.secretIntegrationId,
});

export type CreateIntegration = Omit<
  z.infer<typeof insertIntegrationSchema>,
  'id'
>;
