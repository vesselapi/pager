import { z } from 'zod';

import type { Db } from '@vessel/db';
import { db } from '@vessel/db';

import { useContextHook } from '../../middlewares/use-context-hook';
import { useLogger } from '../../middlewares/use-logger';
import { publicProcedure } from '../../trpc';

interface Context {
  db: Db;
}

const input = z.object({
  filters: z
    .object({
      status: z.object({
        value: z.enum(['ACKED', 'OPEN', 'CLOSED']),
        condition: z.enum(['IS', 'IS_NOT']),
      }),
      title: z.object({
        value: z.string(),
        condition: z.enum(['CONTAINS']),
      }),
      assignedToId: z.object({
        value: z.string(),
        condition: z.enum(['IS', 'IS_NOT']),
      }),
      // TODO(@zkirby): Add filter support for createdAt times.
    })
    .partial()
    .optional(),
});

export const alertList = publicProcedure
  .use(
    useContextHook<Context>({
      db: () => db,
    }),
  )
  .use(useLogger())
  .input(input)
  .query(({ ctx, input }) => {
    return ctx.db.query.alert.findMany({});
  });
