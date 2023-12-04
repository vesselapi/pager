import type { Db } from '@vessel/db';
import { db } from '@vessel/db';

import { customValidators } from '@vessel/types';
import { z } from 'zod';
import { trpc } from '../../middlewares/trpc/common-trpc-hook';
import { useServicesHook } from '../../middlewares/trpc/use-services-hook';

interface Context {
  db: Db;
}

const input = z.object({
  teamId: customValidators.teamId,
});

export const teamFind = trpc
  .use(
    useServicesHook<Context>({
      db: () => db,
    }),
  )
  .input(input)
  .query(async ({ ctx, input }) => {
    const team = await ctx.db.teams.find(input.teamId);
    return { team };
  });
