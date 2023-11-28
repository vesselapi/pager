import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { APP_ID, IntegrationIdRegex } from '@vessel/types';
import type { IntegrationId, OrgId } from '@vessel/types';

import { org } from './org';

export const integration = pgTable('integration', {
  id: text('id').primaryKey(),
  orgId: text('org_id')
    .references(() => org.id)
    .notNull(),
  appId: text('app_id', { enum: APP_ID }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const selectIntegrationSchema = createSelectSchema(integration, {
  id: (schema) => schema.id.transform((x) => x as IntegrationId),
  orgId: (schema) => schema.orgId.transform((x) => x as OrgId),
});

export const insertIntegrationSchema = createInsertSchema(integration, {
  id: (schema) =>
    schema.id
      .regex(
        IntegrationIdRegex,
        `Invalid id, expected format ${IntegrationIdRegex}`,
      )
      .transform((x) => x as IntegrationId),
  orgId: (schema) => schema.orgId.transform((x) => x as OrgId),
});

export type CreateIntegration = z.infer<typeof insertIntegrationSchema>;
