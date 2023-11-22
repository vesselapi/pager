import { experimental_standaloneMiddleware, TRPCError } from '@trpc/server';

import { db } from '@vessel/db';

import { CreateContextOptions, JwtClaims } from '../../trpc';

export const useUserAuth = () =>
  experimental_standaloneMiddleware<{ ctx: CreateContextOptions }>().create(
    async (opts) => {
      const { claims } = opts.ctx.auth;
      if (!claims) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User does not have access',
        });
      }
      const { email } = claims;
      const user = await db.user.findByEmail(email);
      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not found',
        });
      }

      return opts.next<{ auth: { claims: JwtClaims; user: typeof user } }>({
        ctx: { auth: { claims, user } },
      });
    },
  );
