import { ZodObject } from 'zod';

import { CreateContextOptions, publicProcedure } from '../trpc';

export const useTrpcQueryHook =
  <T extends ZodObject<any>>(trpcHookOptions?: { input: T }) =>
  <X, U extends CreateContextOptions, V>(
    func: (opts: { ctx: U; input: V }) => X,
  ) => {
    const cmd = trpcHookOptions?.input
      ? publicProcedure.input(trpcHookOptions?.input)
      : publicProcedure;

    return cmd.query<X>(func);
  };

export const useTrpcMutationHook =
  <T extends ZodObject<any>>(trpcHookOptions: { input: T }) =>
  <X, U extends CreateContextOptions, V>(
    func: (opts: { ctx: U; input: V }) => X,
  ) => {
    const cmd = trpcHookOptions?.input
      ? publicProcedure.input(trpcHookOptions?.input)
      : publicProcedure;

    return cmd.mutation<X>(func);
  };
