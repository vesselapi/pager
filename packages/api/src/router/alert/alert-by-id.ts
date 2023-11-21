import { z } from 'zod';

import type { Db } from '@vessel/db';
import { db } from '@vessel/db';
import type { AlertId } from '@vessel/types';
import { AlertIdRegex } from '@vessel/types';

import { useLogger } from '../../middlewares/use-logger';
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
});

export const alertById = publicProcedure
  .use(
    useServicesHook<Context>({
      db: () => db,
    }),
  )
  .use(useLogger())
  .input(input)
  .query(({ ctx, input }) => {
    return ctx.db.alerts.find(input.id);
  });
