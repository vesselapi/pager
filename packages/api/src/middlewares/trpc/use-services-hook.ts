import { experimental_standaloneMiddleware } from '@trpc/server';
import { objectify, parallel } from 'radash';

export const useServicesHook = <T>(ctxMap: Record<string, Function>) =>
  experimental_standaloneMiddleware().create(async (opts) => {
    const servicesList = await parallel(
      10,
      Object.keys(ctxMap),
      async (key) => {
        const service = ctxMap[key];
        if (!service) {
          throw new Error(
            'useServicesHook - Invalid key in mapping of services',
          );
        }
        return {
          key,
          value: await Promise.resolve(service()),
        };
      },
    );

    const contexts = objectify(
      servicesList,
      (s) => s.key,
      (s) => s.value,
    );

    return opts.next({
      ctx: contexts as T,
    });
  });
