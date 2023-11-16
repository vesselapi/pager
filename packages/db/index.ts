import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { alert } from './schema/alert';
import { alertEvent } from './schema/alertEvent';
import { organization } from './schema/organization';
import { user } from './schema/user';

export const schema = { alert, alertEvent, organization, user };

export * from 'drizzle-orm';

const queryClient = postgres(process.env.DATABASE_URL);

export const db = drizzle(queryClient, { schema });

export type Db = typeof db;

async function main() {
  await db.insert(alert).values({
    id: 'string',
  });
}

main().catch(console.error);
