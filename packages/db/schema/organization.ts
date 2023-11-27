import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import type { OrgId } from '@vessel/types';
import { OrgIdRegex } from '@vessel/types';

export const organization = pgTable('organization', {
  id: text('id').primaryKey(), // v_org_[hash]
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const selectOrgSchema = createSelectSchema(organization, {
  id: (schema) => schema.id.transform((x) => x as OrgId),
});

export const insertOrgSchema = createInsertSchema(organization, {
  id: (schema) =>
    schema.id.regex(OrgIdRegex, `Invalid id, expected format ${OrgIdRegex}`),
});
