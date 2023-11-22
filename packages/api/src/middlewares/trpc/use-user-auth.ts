import { experimental_standaloneMiddleware } from '@trpc/server';

import { db } from '@vessel/db';

import { CreateContextOptions } from '../../trpc';

export const useUserAuth = () =>
  experimental_standaloneMiddleware<{ ctx: CreateContextOptions }>().create(
    async (opts) => {
      if (!opts.ctx.auth.claims) {
        throw new Error('User does not have access');
      }
      const { email } = opts.ctx.auth.claims;
      const user = await db.user.findByEmail(email);

      return opts.next({
        ctx: { user },
      });
    },
  );
