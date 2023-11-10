import { db, Db } from '@vessel/db';

import { useContextHook } from '../hooks/use-context-hook';
import { useTrpcQueryHook } from '../hooks/use-trpc-hook';
import { CreateContextOptions } from '../trpc';

type Options = {
  ctx: { db: Db } & CreateContextOptions;
};

const list = ({ ctx }: Options) => {
  return ctx.db.query.post.findMany();
};

export const postList = useTrpcQueryHook()(useContextHook({ db })(list));
