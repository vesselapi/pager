import type { Db } from '@vessel/db';
import { db } from '@vessel/db';

import { parallel } from 'radash';
import { trpc } from '../../middlewares/trpc/common-trpc-hook';
import { useServicesHook } from '../../middlewares/trpc/use-services-hook';
import { UserManager, makeUserManager } from '../../services/user-manager';

interface Context {
  db: Db;
  userManager: UserManager;
}

export const userList = trpc
  .use(
    useServicesHook<Context>({
      db: () => db,
      userManager: makeUserManager,
    }),
  )
  .query(async ({ ctx }) => {
    const users = await ctx.db.user.listByOrgId(ctx.auth.user.orgId);
    return {
      users: await parallel(15, users, ctx.userManager.profilePic.addToUser),
    };
  });
