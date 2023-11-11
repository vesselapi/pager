import { compose } from 'radash';
import { z } from 'zod';

import { db, Db, eq, schema } from '@vessel/db';

import { useContextHook } from '../middlewares/use-context-hook';
import { useLogger } from '../middlewares/use-logger';
import { CreateContextOptions, publicProcedure } from '../trpc';

const input = z.number();

type Context = { db: Db } & CreateContextOptions;

export const postDelete = publicProcedure
  .use(
    useContextHook<Context>({
      db: () => db,
    }),
  )
  .use(useLogger())
  .input(input)
  .mutation(({ ctx, input }) => {
    return ctx.db.delete(schema.post).where(eq(schema.post.id, input));
  });
