import type { Db } from '@vessel/db';
import { db } from '@vessel/db';

import { insertTeamSchema } from '@vessel/db/schema/team';
import { z } from 'zod';
import { trpc } from '../../middlewares/trpc/common-trpc-hook';
import { useServicesHook } from '../../middlewares/trpc/use-services-hook';

interface Context {
  db: Db;
}

const input = z.object({
  team: insertTeamSchema.pick({
    name: true,
  }),
});

export const teamCreate = trpc
  .use(
    useServicesHook<Context>({
      db: () => db,
    }),
  )
  .input(input)
  .mutation(async ({ ctx, input }) => {
    const { orgId } = ctx.auth.user;
    const team = await ctx.db.teams.create({ orgId, ...input.team });
    return { team };
  });
