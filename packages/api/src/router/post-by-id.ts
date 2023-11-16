import { z } from 'zod';

import { db, Db, eq, schema } from '@vessel/db';

import { useLogger } from '../middlewares/use-logger';
import { useServicesHook } from '../middlewares/use-services-hook';
import { publicProcedure } from '../trpc';

type Context = {
  db: Db;
};
const input = z.object({ id: z.number() });

export const postById = publicProcedure
  .use(
    useServicesHook<Context>({
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
