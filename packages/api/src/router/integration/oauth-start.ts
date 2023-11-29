import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import type { Db} from '@vessel/db';
import { db } from '@vessel/db';
import { APP_ID } from '@vessel/types';

import { env } from '../../../env.mjs';
import { trpc } from '../../middlewares/trpc/common-trpc-hook';
import { useServicesHook } from '../../middlewares/trpc/use-services-hook';
import type { Integrations} from '../../services/integrations';
import { makeIntegrations } from '../../services/integrations';
import type {
  Oauth2Client} from '../../services/integrations/oauth';
import {
  makeOauth2Client
} from '../../services/integrations/oauth';

interface Context {
  db: Db;
  integrations: Integrations;
  oauth2Client: Oauth2Client;
}
const input = z.object({
  appId: z.enum(APP_ID),
});

export const integrationOAuthStart = trpc
  .use(
    useServicesHook<Context>({
      db: () => db,
      integrations: makeIntegrations,
      oauth2Client: makeOauth2Client,
    }),
  )
  .input(input)
  .mutation(async ({ ctx, input }) => {
    const { integrations, oauth2Client } = ctx;
    const { appId } = input;
    const integration = integrations.find(appId);
    const { auth } = integration;

    if (auth.type !== 'oauth2') {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Integration provided is not oauth2',
      });
    }

    const authUrl = await oauth2Client.authorizeURL({
      config: auth,
      redirectUri: `${env.VERCEL_URL}/settings/integrations/oauth-callback/${appId}`,
    });
    return {
      authUrl,
    };
  });
