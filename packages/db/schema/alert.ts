import { json, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { user } from './user';

export const alert = pgTable('alert', {
  id: text('id').primaryKey(), // v_alert_[hash]
  title: text('title'),
  status: text('status', { enum: ['ACKED', 'OPEN', 'CLOSED'] })
    .default('OPEN')
    .notNull(),
  assignedToId: text('assigned_to_id').references(() => user.id),
  createdAt: timestamp('created_at').notNull(),
  metadata: json('metadata'),
});

const alertSelectSchema = createSelectSchema(alert);
export type Alert = z.infer<typeof alertSelectSchema>;
