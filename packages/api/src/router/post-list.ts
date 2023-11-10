import { db, Db } from '@vessel/db';

import { useContextHook } from '../middlewares/use-context-hook';
import { useLogger } from '../middlewares/use-logger';
import { publicProcedure } from '../trpc';

type Context = {
  db: Db;
};

export const postList = publicProcedure
  .use(
    useContextHook<Context>({
      db: () => db,
    }),
  )
  .use(useLogger())
  .query(({ ctx }) => {
    return ctx.db.query.post.findMany();
  });
