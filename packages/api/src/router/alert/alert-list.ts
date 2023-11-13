import type { Db } from '@vessel/db';
import { db } from '@vessel/db';

import { useContextHook } from '../../middlewares/use-context-hook';
import { useLogger } from '../../middlewares/use-logger';
import { publicProcedure } from '../../trpc';

interface Context {
  db: Db;
}

export const alertList = publicProcedure
  .use(
    useContextHook<Context>({
      db: () => db,
    }),
  )
  .use(useLogger())
  .query(({ ctx }) => {
    return ctx.db.query.alert.findMany();
  });
