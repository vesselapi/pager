import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { alert } from './schema/alert';
import { alertEvent } from './schema/alertEvent';
import { organization } from './schema/organization';
import { secret } from './schema/secret';
import { user } from './schema/user';

export const schema = { alert, alertEvent, organization, user, secret };

export * from 'drizzle-orm';

const queryClient = postgres(process.env.DATABASE_URL);

export const db = drizzle(queryClient, { schema });
export type Db = typeof db;
