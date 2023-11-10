import { compose } from 'radash';
import { z } from 'zod';

import { db, Db, eq, schema } from '@vessel/db';

import { useContextHook } from '../hooks/use-context-hook';
import { useTrpcHook, useTrpcQueryHook } from '../hooks/use-trpc-hook';

const input = z.object({ id: z.number() });
type Options = {
  ctx: { db: Db };
  input: z.infer<typeof input>;
};

const byId = ({ ctx, input }: Options) => {
  return ctx.db.query.post.findFirst({
    where: eq(schema.post.id, input.id),
  });
};

export const postById = useTrpcQueryHook({ input })(
  useContextHook({ db })(byId),
);
