import { TRPCError } from '@trpc/server';

import type { Db } from '@vessel/db';
import { db } from '@vessel/db';

import { useServicesHook } from '../../middlewares/trpc/use-services-hook';
import type { UserManager } from '../../services/user-manager';
import { makeUserManager } from '../../services/user-manager';
import { procedure } from '../../trpc';

interface Context {
  db: Db;
  userManager: UserManager;
}

export const userMe = procedure
  .use(
    useServicesHook<Context>({
      db: () => db,
      userManager: makeUserManager,
    }),
  )
  .mutation(async ({ ctx }) => {
    if (!ctx.auth.claims) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Claims not found',
      });
    }

    const claims = ctx.auth.claims;

    const foundUser = await ctx.db.user.findByEmail(claims.email);

    if (foundUser)
      return { user: await ctx.userManager.profilePic.addToUser(foundUser) };
    return { user: null };
  });
