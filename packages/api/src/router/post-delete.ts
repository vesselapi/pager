import { compose } from 'radash';
import { z } from 'zod';

import { db, Db, desc, eq, schema } from '@vessel/db';

import { useContextHook } from '../hooks/use-context-hook';
import { useTrpcHook, useTrpcQueryHook } from '../hooks/use-trpc-hook';
import { CreateContextOptions } from '../trpc';

const input = z.object({
  id: z.number(),
});
type Options = {
  ctx: { db: Db } & CreateContextOptions;
  input: z.infer<typeof input>;
};

const del = ({ ctx, input }: Options) => {
  return ctx.db.delete(schema.post).where(eq(schema.post.id, input.id));
};

export const postDelete = useTrpcQueryHook({ input })(
  useContextHook({ db })(del),
);
