import type { Db } from '@vessel/db';
import { db } from '@vessel/db';

import { useServicesHook } from '../../middlewares/use-services-hook';
import { publicProcedure } from '../../trpc';

interface Context {
  db: Db;
}

export const userList = publicProcedure
  .use(
    useServicesHook<Context>({
      db: () => db,
    }),
  )
  .query(({ ctx }) => {
    return ctx.db.user.list();
  });
