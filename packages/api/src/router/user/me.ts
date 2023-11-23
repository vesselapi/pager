import { z } from 'zod';

import type { Db } from '@vessel/db';
import { db } from '@vessel/db';
import { AlertId, AlertIdRegex } from '@vessel/types';

import { trpc } from '../../middlewares/trpc/common-trpc-hook';
import { useServicesHook } from '../../middlewares/trpc/use-services-hook';

interface Context {
  db: Db;
}
const input = z.object({
  id: z
    .string()
    .regex(AlertIdRegex, `Invalid id, expected format ${AlertIdRegex}`)
    .transform((x) => x as AlertId),
});

export const alertById = trpc
  .use(
    useServicesHook<Context>({
      db: () => db,
    }),
  )
  .input(input)
  .query(({ ctx, input }) => {
    return ctx.db.alerts.find(input.id);
  });
