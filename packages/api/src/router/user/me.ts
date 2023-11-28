import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import type { Db } from '@vessel/db';
import { db } from '@vessel/db';

import { useServicesHook } from '../../middlewares/trpc/use-services-hook';
import { procedure } from '../../trpc';

interface Context {
  db: Db;
}

const input = z.object({ id: z.string() });

export const userMe = procedure
  .use(
    useServicesHook<Context>({
      db: () => db,
    }),
  )
  .input(input)
  .mutation(async ({ ctx }) => {
    const claims = ctx.auth.claims;
    if (!claims) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Claims not found',
      });
    }

    const foundUser = await ctx.db.user.findByEmail(claims.email);
    if (foundUser) return { user: foundUser };

    const org = await db.orgs.create();
    const newUser = await ctx.db.user.create({
      email: claims.email,
      orgId: org.id,
      firstName: claims.first_name,
      lastName: claims.last_name,
    });
    return { user: newUser };
  });
