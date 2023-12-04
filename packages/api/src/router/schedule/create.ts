import { z } from 'zod';

import type { Db } from '@vessel/db';
import { db } from '@vessel/db';
import { IdGenerator } from '@vessel/db/id-generator';
import { insertScheduleSchema } from '@vessel/db/schema/schedule';

import { insertScheduleUserSchema } from '@vessel/db/schema/schedule-user';
import { customValidators } from '@vessel/types';
import { unique } from 'radash';
import { trpc } from '../../middlewares/trpc/common-trpc-hook';
import { useServicesHook } from '../../middlewares/trpc/use-services-hook';

interface Context {
  db: Db;
}

const args = z.object({
  teamId: customValidators.teamId,
  schedule: insertScheduleSchema.pick({
    name: true,
    startTime: true,
    lengthInSeconds: true,
  }),
  scheduleUsers: z
    .array(insertScheduleUserSchema.pick({ order: true, userId: true }))
    .refine((scheduleUsers) => {
      const uniqueUsers = unique(
        scheduleUsers,
        (scheduleUser) => scheduleUser.order,
      );
      return uniqueUsers.length === scheduleUsers.length;
    }, 'Order must be unique')
    .refine((scheduleUsers) => {
      const uniqueUsers = unique(scheduleUsers, (user) => user.userId);
      return uniqueUsers.length === scheduleUsers.length;
    }, 'Users must be unique'),
});

export const scheduleCreate = trpc
  .use(
    useServicesHook<Context>({
      db: () => db,
    }),
  )
  .input(args)
  .mutation(async ({ ctx, input }) => {
    const { orgId } = ctx.auth.user;
    const schedule = await ctx.db.schedules.create({
      orgId,
      teamId: input.teamId,
      ...input.schedule,
    });

    const insertScheduleUsers = input.scheduleUsers.map((scheduleUser) => ({
      id: IdGenerator.scheduleUser(),
      orgId,
      scheduleId: schedule.id,
      ...scheduleUser,
    }));

    const users = await ctx.db.scheduleUsers.createMany(insertScheduleUsers);
    return {
      schedule: {
        ...schedule,
        users,
      },
    };
  });
