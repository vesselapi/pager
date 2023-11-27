import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

import { schema } from '.';

async function run() {
  const queryClient = postgres(process.env.DATABASE_URL, { max: 1 });

  const db = drizzle(queryClient, { schema });

  await migrate(db, { migrationsFolder: './drizzle' });

  await queryClient.end();
}

run();
