import type { Db } from '@vessel/db';
import { db } from '@vessel/db';

import { trpc } from '../../middlewares/trpc/common-trpc-hook';
import { useServicesHook } from '../../middlewares/trpc/use-services-hook';

interface Context {
  db: Db;
}

export const scheduleList = trpc
  .use(
    useServicesHook<Context>({
      db: () => db,
    }),
  )
  .query(({ ctx }) => {
    return ctx.db.schedules.listByOrgId(ctx.auth.user.orgId);
  });
