import type { Db } from '@vessel/db';
import { db } from '@vessel/db';

import { insertUserSchema } from '@vessel/db/schema/user';
import { z } from 'zod';
import { trpc } from '../../middlewares/trpc/common-trpc-hook';
import { useServicesHook } from '../../middlewares/trpc/use-services-hook';

interface Context {
  db: Db;
}

const input = z.object({
  user: insertUserSchema.pick({
    firstName: true,
    lastName: true,
  }),
});

export const userUpdate = trpc
  .use(
    useServicesHook<Context>({
      db: () => db,
    }),
  )
  .input(input)
  .mutation(async ({ ctx, input }) => {
    const { user } = ctx.auth;
    await db.user.update(user.id, input.user);
    return { success: true };
  });
