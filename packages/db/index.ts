import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as post from './schema/user';

export const schema = { ...post };

export * from 'drizzle-orm';

const queryClient = postgres(process.env.DATABASE_URL);

export const db = drizzle(queryClient, { schema });
export type Db = typeof db;
