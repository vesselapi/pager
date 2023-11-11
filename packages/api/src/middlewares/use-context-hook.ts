import { experimental_standaloneMiddleware } from '@trpc/server';
import { objectify, parallel } from 'radash';

export const useContextHook = <T>(ctxMap: Record<string, Function>) =>
  experimental_standaloneMiddleware().create(async (opts) => {
    const ctxList = await parallel(10, Object.keys(ctxMap), async (key) => {
      const ctx = ctxMap[key];
      if (!ctx) {
        throw new Error('useContextHook - Invalid key in ctxMap');
      }
      return {
        key,
        value: await Promise.resolve(ctx()),
      };
    });

    const contexts = objectify(
      ctxList,
      (s) => s.key,
      (s) => s.value,
    );

    return opts.next({
      ctx: contexts as T,
    });
  });
