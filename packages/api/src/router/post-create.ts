import { z } from 'zod';

import { db, Db, schema } from '@vessel/db';

import { useLogger } from '../middlewares/use-logger';
import { useServicesHook } from '../middlewares/use-services-hook';
import { publicProcedure } from '../trpc';

const input = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
});
type Context = { db: Db };

export const postCreate = publicProcedure
  .use(
    useServicesHook<Context>({
      db: () => db,
    }),
  )
  .use(useLogger())
  .input(input)
  .mutation(({ ctx, input }) => {
    return ctx.db.insert(schema.post).values(input);
  });
