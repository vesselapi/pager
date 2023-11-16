import * as crypto from 'crypto';
// import { getPinoTransport } from '@hyperdx/node-opentelemetry';
import { experimental_standaloneMiddleware } from '@trpc/server';
import pino from 'pino';

import { CreateContextOptions } from '../trpc';

const MAX_LEVEL = 'info';

export const logger = pino(
  pino.transport({
    targets: [
      // getPinoTransport(MAX_LEVEL),
      // other transports
    ],
  }),
);

export type Logger = typeof logger;

export const useLogger = () =>
  experimental_standaloneMiddleware<{ ctx: CreateContextOptions }>().create(
    async (opts) => {
      const req = opts.ctx.req;
      const reqId = crypto.randomBytes(16).toString('hex');
      const reqLogger = logger.child({
        reqId,
        commit: process.env.VERCEL_GIT_COMMIT_MESSAGE,
        pr: `#${process.env.VERCEL_GIT_PULL_REQUEST_ID}`,
        method: req.method,
        url: req.url,
      });
      return opts.next<{ logger: typeof reqLogger }>({
        ctx: { logger: reqLogger },
      });
    },
  );
