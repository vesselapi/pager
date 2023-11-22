import { experimental_standaloneMiddleware } from '@trpc/server';

import { db } from '@vessel/db';

import { CreateContextOptions, JwtClaims } from '../../trpc';

export const useUserAuth = () =>
  experimental_standaloneMiddleware<{ ctx: CreateContextOptions }>().create(
    async (opts) => {
      const { claims } = opts.ctx.auth;
      if (!claims) {
        throw new Error('User does not have access');
      }
      const { email } = claims;
      const user = await db.user.findByEmail(email);
      if (!user) {
        throw new Error('User not found');
      }

      return opts.next<{ auth: { claims: JwtClaims; user: typeof user } }>({
        ctx: { auth: { claims, user } },
      });
    },
  );
