import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { APP_ID, IntegrationIdRegex } from '@vessel/types';
import type { AppId, IntegrationId } from '@vessel/types';

import { organization } from './organization';

export const integration = pgTable('integration', {
  id: text('id').primaryKey(), // v_integration_[hash]
  organizationId: text('organization_id')
    .references(() => organization.id)
    .notNull(),
  appId: text('app_id', { enum: APP_ID }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const selectIntegrationSchema = createSelectSchema(integration, {
  id: (schema) => schema.id.transform((x) => x as IntegrationId),
});

export const insertIntegrationSchema = createInsertSchema(integration, {
  id: (schema) =>
    schema.id.regex(
      IntegrationIdRegex,
      `Invalid id, expected format ${IntegrationIdRegex}`,
    ),
});

export type CreateIntegration = z.infer<typeof insertIntegrationSchema>;
