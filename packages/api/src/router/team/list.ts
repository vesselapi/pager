import type { Db } from '@vessel/db';
import { db } from '@vessel/db';

import { z } from 'zod';
import { trpc } from '../../middlewares/trpc/common-trpc-hook';
import { useServicesHook } from '../../middlewares/trpc/use-services-hook';

interface Context {
  db: Db;
}

const input = z
  .object({
    _experimental: z
      .object({
        // NOTE(@zkirby): This is a potentially costly operation so we'll make it opt-in
        withUsers: z.boolean().optional(),
      })
      .optional(),
  })
  .strict();

export const teamList = trpc
  .use(
    useServicesHook<Context>({
      db: () => db,
    }),
  )
  .input(input)
  .query(async ({ ctx, input }) => {
    const teams = await ctx.db.teams.listByOrgId(ctx.auth.user.orgId, {
      withUsers: input._experimental?.withUsers,
    });
    return { teams };
  });
