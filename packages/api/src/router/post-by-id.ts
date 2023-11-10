import { z } from 'zod';

import { db, Db, eq, schema } from '@vessel/db';

import { useContextHook } from '../middlewares/use-context-hook';
import { useLogger } from '../middlewares/use-logger';
import { publicProcedure } from '../trpc';

type Context = {
  db: Db;
};
const input = z.object({ id: z.number() });

export const postById = publicProcedure
  .use(
    useContextHook<Context>({
      db: () => db,
    }),
  )
  .use(useLogger())
  .input(input)
  .query(({ ctx, input }) => {
    return ctx.db.query.post.findFirst({
      where: eq(schema.post.id, input.id),
    });
  });
