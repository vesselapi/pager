import { TRPCError } from '@trpc/server';

import type { Db } from '@vessel/db';
import { db } from '@vessel/db';

import { IdGenerator } from '@vessel/db/id-generator';
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

    const org = await db.orgs.create();

    const userId = IdGenerator.user();

    const uploadProfilePic = async () => {
      if (!claims.image_url) return;
      const { key } = await ctx.userManager.profilePic.put({
        id: userId,
        url: claims.image_url,
      });
      return key;
    };
    const imageS3Key = await uploadProfilePic();

    const newUser = await ctx.db.user.create({
      id: userId,
      email: claims.email,
      orgId: org.id,
      firstName: claims.first_name,
      lastName: claims.last_name,
      externalId: claims.id,
      imageS3Key,
    });

    return { user: await ctx.userManager.profilePic.addToUser(newUser) };
  });
