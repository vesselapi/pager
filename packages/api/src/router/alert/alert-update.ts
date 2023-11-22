import { z } from 'zod';

import type { Db } from '@vessel/db';
import { db } from '@vessel/db';
import type { AlertId, UserId } from '@vessel/types';
import { AlertIdRegex, UserIdRegex } from '@vessel/types';

import { useServicesHook } from '../../middlewares/use-services-hook';
import { publicProcedure } from '../../trpc';

interface Context {
  db: Db;
}
const input = z.object({
  id: z
    .string()
    .regex(AlertIdRegex, `Invalid id, expected format ${AlertIdRegex}`)
    .transform((x) => x as AlertId),
  alert: z
    .object({
      assignedToId: z
        .string()
        .regex(UserIdRegex, `Invalid id, expected format ${UserIdRegex}`)
        .transform((x) => x as UserId),
      status: z.enum(['ACKED', 'OPEN', 'CLOSED']),
    })
    .partial(),
});

export const alertUpdate = publicProcedure
  .use(
    useServicesHook<Context>({
      db: () => db,
    }),
  )
  .input(input)
  .mutation(({ ctx, input }) => {
    return ctx.db.alerts.update(input.id, input.alert);
  });
