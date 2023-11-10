import { compose } from 'radash';
import { z } from 'zod';

import { db, Db, schema } from '@vessel/db';

import { useContextHook } from '../hooks/use-context-hook';
import { useTrpcMutationHook } from '../hooks/use-trpc-hook';

const input = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
});
type Options = {
  ctx: { db: Db };
  input: z.infer<typeof input>;
};

const create = ({ ctx, input }: Options) => {
  return ctx.db.insert(schema.post).values(input);
};

export const postCreate = useTrpcMutationHook({ input })(
  useContextHook({ db })(create),
);
