import type { Db } from '@vessel/db';
import { db } from '@vessel/db';

import { trpc } from '../../middlewares/trpc/common-trpc-hook';
import { useServicesHook } from '../../middlewares/trpc/use-services-hook';

import { differenceInDays } from 'date-fns';

interface Context {
  db: Db;
}

export const scheduleList = trpc
  .use(
    useServicesHook<Context>({
      db: () => db,
    }),
  )
  .query(async ({ ctx }) => {
    const { orgId } = ctx.auth.user;
    const schedules = await ctx.db.schedules.listByOrgId(orgId);

    return {
      // TODO(@zkirby): Move this to schedule.view.ts since it might
      // need to be applied to individual schedule find calls too.
      schedules: schedules.map((schedule) => {
        // Denote the oncall User
        // Step 1: Make sure users are sorted by order.
        const users = schedule.users.sort((a, b) => a.order - b.order);

        // Step 2: Find the oncall user via the rotation start time and length.
        const startTimeInDays = schedule.startTime;
        const scheduleLengthInDays = Math.floor(
          parseInt(schedule.lengthInSeconds) / (60 * 60 * 24),
        );
        const timeSinceScheduleStarted = differenceInDays(
          Date.now(),
          startTimeInDays,
        );

        // Step 3: Use the total number of rotations that have happened
        // so far to find who is currently oncall
        const totalNumberOfRotations = Math.floor(
          timeSinceScheduleStarted / scheduleLengthInDays,
        );
        const indexOfOnCall = totalNumberOfRotations % users.length;

        return {
          ...schedule,
          users: users.map((user, index) => ({
            ...user,
            isOnCall: index === indexOfOnCall,
          })),
        };
      }),
    };
  });
