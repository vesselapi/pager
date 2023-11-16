import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { alert } from './schema/alert';
import { alertEvent } from './schema/alertEvent';
import { organization } from './schema/organization';
import { user } from './schema/user';

export const schema = { alert, alertEvent, organization, user };

export * from 'drizzle-orm';

const queryClient = postgres(process.env.DATABASE_URL);

const drizzleDbClient = drizzle(queryClient, { schema });

const createDbClient = (db: typeof drizzleDbClient) => ({
  alerts: {
    find: () => ({}),
    list: () => ({}),
    upsert: () => ({}),
  },
  user: {},
});

export const db = createDbClient(drizzleDbClient);
export type Db = typeof db;
