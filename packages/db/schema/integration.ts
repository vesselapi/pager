import { pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

import type { IntegrationId, OrgId, SecretIntegrationId } from '@vessel/types';
import {
  APP_ID,
  IntegrationIdRegex,
  OrgIdRegex,
  SecretIntegrationIdRegex,
} from '@vessel/types';

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
  id: (schema) => schema.id.transform((x) => x as IntegrationId),
  orgId: (schema) => schema.orgId.transform((x) => x as OrgId),
  secretId: (schema) =>
    schema.secretId.transform((x) => x as SecretIntegrationId),
});

export const insertIntegrationSchema = createInsertSchema(integration, {
  id: (schema) =>
    schema.id
      .regex(
        IntegrationIdRegex,
        `Invalid id, expected format ${IntegrationIdRegex}`,
      )
      .transform((x) => x as IntegrationId),
  orgId: (schema) =>
    schema.orgId
      .regex(OrgIdRegex, `Invalid id, expected format ${OrgIdRegex}`)
      .transform((x) => x as OrgId),
  secretId: (schema) =>
    schema.secretId
      .regex(
        SecretIntegrationIdRegex,
        `Invalid id, expected format ${SecretIntegrationIdRegex}`,
      )
      .transform((x) => x as SecretIntegrationId),
});

export type CreateIntegration = Omit<
  z.infer<typeof insertIntegrationSchema>,
  'id'
>;
