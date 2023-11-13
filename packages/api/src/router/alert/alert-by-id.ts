import { z } from 'zod';

import type { Db } from '@vessel/db';
import { db, eq, schema } from '@vessel/db';

import { useContextHook } from '../../middlewares/use-context-hook';
import { useLogger } from '../../middlewares/use-logger';
import { publicProcedure } from '../../trpc';

interface Context {
  db: Db;
}
const input = z.object({ id: z.number() });

export const alertById = publicProcedure
  .use(
    useContextHook<Context>({
      db: () => db,
    }),
  )
  .use(useLogger())
  .input(input)
  .query(({ ctx, input }) => {
    return ctx.db.query.alert.findFirst({
      where: eq(schema.alert.id, input.id),
    });
  });
