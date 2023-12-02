import { TRPCError } from '@trpc/server';

import type { Db } from '@vessel/db';
import { db } from '@vessel/db';

import { IdGenerator } from '@vessel/db/id-generator';
import { User } from '@vessel/db/schema/user';
import { omit } from 'radash';
import { useServicesHook } from '../../middlewares/trpc/use-services-hook';
import { UserManager, makeUserManager } from '../../services/user-manager';
import { JwtClaims, procedure } from '../../trpc';

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

    const claims = ctx.auth.claims as JwtClaims;

    const addProfilePicToUser = async (user: User) => {
      const imageUrl = await ctx.userManager.profilePic.getUrl(user.id);
      return { ...omit(user, ['imageS3Key']), imageUrl };
    };

    const foundUser = await ctx.db.user.findByEmail(claims.email);

    if (foundUser) return { user: await addProfilePicToUser(foundUser) };

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

    return { user: await addProfilePicToUser(newUser) };
  });
