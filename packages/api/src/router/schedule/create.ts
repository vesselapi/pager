import { unique } from 'radash';
import { z } from 'zod';

import type { Db } from '@vessel/db';
import { db } from '@vessel/db';
import { IdGenerator } from '@vessel/db/id-generator';
import { insertRotationSchema } from '@vessel/db/schema/rotation';
import { insertRotationUserSchema } from '@vessel/db/schema/rotation-user';
import { insertScheduleSchema } from '@vessel/db/schema/schedule';

import { trpc } from '../../middlewares/trpc/common-trpc-hook';
import { useServicesHook } from '../../middlewares/trpc/use-services-hook';

interface Context {
  db: Db;
}

const args = z.object({
  schedule: insertScheduleSchema.pick({ name: true }),
  rotations: z.array(
    z.object({
      rotation: insertRotationSchema.pick({
        startTime: true,
        lengthInSeconds: true,
        name: true,
      }),
      users: z
        .array(insertRotationUserSchema.pick({ order: true, userId: true }))
        .refine((users) => {
          const uniqueUsers = unique(users, (user) => user.order);
          return uniqueUsers.length === users.length;
        }, 'Order must be unique')
        .refine((users) => {
          const uniqueUsers = unique(users, (user) => user.userId);
          return uniqueUsers.length === users.length;
        }, 'Users must be unique'),
    }),
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
    const { orgId } = ctx.auth.user;
    const schedule = await ctx.db.schedules.create({
      orgId,
      ...input.schedule,
    });

    const rotations = input.rotations.map((rotation) => ({
      id: IdGenerator.schedule(),
      ...rotation,
    }));
    const dbRotations = await ctx.db.rotations.createMany(
      rotations.map((rotation) => ({
        orgId,
        scheduleId: schedule.id,
        ...rotation.rotation,
      })),
    );

    const rotationUsers = rotations.flatMap((rotation) => {
      return rotation.users.map((user) => ({
        orgId,
        rotationId: rotation.id,
        ...user,
      }));
    });
    const dbRotationUsers =
      await ctx.db.rotationUsers.createMany(rotationUsers);
    return { schedule, rotations: dbRotations, rotationUsers: dbRotationUsers };
  });
