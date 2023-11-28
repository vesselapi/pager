import { unique } from 'radash';
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
  users: z
    .array(
      z.object({
        id: z.string().regex(UserIdRegex, 'Users must be valid user ids'),
        order: z.number(),
      }),
    )
    .refine((users) => {
      const uniqueUsers = unique(users, (user) => user.order);
      return uniqueUsers.length === users.length;
    }, 'Order must be unique'),
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
      input.users.map((user) => ({
        userId: user.id,
        order: user.order,
        orgId: ctx.auth.user.orgId,
        scheduleId: schedule.id,
      })),
    );
    return { schedule };
  });
