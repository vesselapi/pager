import type { Db } from '@vessel/db';
import { db } from '@vessel/db';

import { unique } from 'radash';
import { trpc } from '../../middlewares/trpc/common-trpc-hook';
import { useServicesHook } from '../../middlewares/trpc/use-services-hook';

interface Context {
  db: Db;
}

export const teamList = trpc
  .use(
    useServicesHook<Context>({
      db: () => db,
    }),
  )
  .query(async ({ ctx }) => {
    const teams = await ctx.db.teams.listByOrgId(ctx.auth.user.orgId);

    return {
      teams: teams.map((team) => {
        // NOTE(@zkirby): Flatten users into teams and scheduleUsers into users for convenience.
        return {
          ...team,
          users: unique(
            team.schedules.flatMap((schedule) =>
              schedule.scheduleUsers.map((scheduleUser) => ({
                ...scheduleUser,
                ...scheduleUser.user,
              })),
            ),
            (u) => u.id,
          ),
        };
      }),
    };
  });
