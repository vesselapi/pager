import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import {
  APP_ID,
  IntegrationIdRegex,
  OrgIdRegex,
  SecretIdRegex,
} from '@vessel/types';
import type { IntegrationId, OrgId, SecretId } from '@vessel/types';

import { schema } from '..';
import { org } from './org';
import { secret } from './secret';

export const integration = pgTable('integration', {
  id: text('id').primaryKey(),
  orgId: text('org_id')
    .references(() => org.id)
    .notNull(),
  appId: text('app_id', { enum: APP_ID }).notNull(),
  secretId: text('secret_id').references(() => secret.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const selectIntegrationSchema = createSelectSchema(integration, {
  id: (schema) => schema.id.transform((x) => x as IntegrationId),
  orgId: (schema) => schema.orgId.transform((x) => x as OrgId),
  secretId: (schema) => schema.secretId.transform((x) => x as SecretId),
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
      .regex(SecretIdRegex, `Invalid id, expected format ${SecretIdRegex}`)
      .transform((x) => x as SecretId),
});

export type CreateIntegration = z.infer<typeof insertIntegrationSchema>;
