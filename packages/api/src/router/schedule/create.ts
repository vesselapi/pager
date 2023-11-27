import { z } from 'zod';

import { Db, db } from '@vessel/db';
import { insertScheduleSchema } from '@vessel/db/schema/schedule';
import { UserIdRegex } from '@vessel/types';

import { trpc } from '../../middlewares/trpc/common-trpc-hook';
import { useServicesHook } from '../../middlewares/trpc/use-services-hook';

interface Context {
  db: Db;
}

const args = z.object({
  schedule: insertScheduleSchema,
  userIds: z.array(
    z.string().regex(UserIdRegex, 'Users must be valid user ids'),
  ),
});

export const scheduleCreate = trpc
  .use(
    useServicesHook<Context>({
      db: () => db,
    }),
  )
  .input(args)
  .mutation(async ({ ctx, input }) => {
    const schedule = await ctx.db.schedules.create(input.schedule);
    await ctx.db.scheduleUsers.createMany(
      input.userIds.map((userId, idx) => ({
        userId,
        order: idx,
        orgId: ctx.auth.user.orgId,
        scheduleId: schedule.id,
      })),
    );
    return { schedule };
  });
