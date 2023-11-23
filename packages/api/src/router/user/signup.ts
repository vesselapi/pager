import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import type { Db } from '@vessel/db';
import { db } from '@vessel/db';

import { useServicesHook } from '../../middlewares/trpc/use-services-hook';
import { procedure } from '../../trpc';

interface Context {
  db: Db;
}

export const alertById = procedure
  .use(
    useServicesHook<Context>({
      db: () => db,
    }),
  )
  .mutation(async ({ ctx }) => {
    const claims = ctx.auth.claims;
    if (!claims) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Claims not found',
      });
    }

    const id = await ctx.db.user.create({
      email: claims.email,
      organizationId: '',
      firstName: claims.first_name,
      lastName: claims.last_name,
    });
  });
