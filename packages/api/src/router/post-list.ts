import { db, Db } from '@vessel/db';

import { useLogger } from '../middlewares/use-logger';
import { useServicesHook } from '../middlewares/use-services-hook';
import { publicProcedure } from '../trpc';

type Context = {
  db: Db;
};

export const postList = publicProcedure
  .use(
    useServicesHook<Context>({
      db: () => db,
    }),
  )
  .use(useLogger())
  .query(({ ctx }) => {
    return ctx.db.query.post.findMany();
  });
