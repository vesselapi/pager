import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import type { OrgId } from '@vessel/types';
import { OrgIdRegex } from '@vessel/types';

export const org = pgTable('org', {
  id: text('id').primaryKey(), // v_org_[hash]
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const selectOrgSchema = createSelectSchema(org, {
  id: (schema) => schema.id.transform((x) => x as OrgId),
});

export const insertOrgSchema = createInsertSchema(org, {
  id: (schema) =>
    schema.id.regex(OrgIdRegex, `Invalid id, expected format ${OrgIdRegex}`),
});
