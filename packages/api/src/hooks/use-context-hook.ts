import { objectify, parallel } from 'radash';

export const useContextHook =
  (ctxMap: Record<string, Promise<any> | any>) =>
  <X, U, V>(func: (opts: { ctx: U; input: V }) => X) =>
  async (opts: { ctx: U; input: V }) => {
    const ctxList = await parallel(10, Object.keys(ctxMap), async (key) => {
      const ctx = ctxMap[key];
      return {
        key,
        value: await Promise.resolve(ctx),
      };
    });

    const contexts = objectify(
      ctxList,
      (s) => s.key,
      (s) => s.value,
    );

    return await func({
      ...opts,
      ctx: {
        ...opts.ctx,
        ...contexts,
      },
    });
  };
