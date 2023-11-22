import { pick } from 'radash';
import { z } from 'zod';

import { Db, db } from '@vessel/db';
import { APP_ID, AppId } from '@vessel/types';

import { useLogger } from '../../middlewares/use-logger';
import { useServicesHook } from '../../middlewares/use-services-hook';
import { Integrations, makeIntegrations } from '../../services/integrations';
import {
  makeOauth2Client,
  Oauth2Client,
} from '../../services/integrations/oauth';
import { publicProcedure } from '../../trpc';

interface Context {
  db: Db;
  integrations: Integrations;
  oauth2Client: Oauth2Client;
}
const input = z.object({
  code: z.string(),
  state: z.preprocess(
    (val) => JSON.parse(Buffer.from(val as string, 'base64').toString('utf8')),
    z.object({
      appId: z
        .string()
        .refine((appId) => APP_ID.includes(appId as AppId))
        .transform((appId) => appId as AppId),
    }),
  ),
});

export const integrationConnect = publicProcedure
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
    const { code, state } = input;
    const integration = integrations.find(state.appId);

    const { auth } = integration;
    if (auth.type !== 'oauth2') {
      throw new Error('Integration provided is not oauth2');
    }

    const secret = await oauth2Client.exchange({
      config: auth,
      code,
      redirectUri: `https://app.vessel.dev/settings/integrations/${state.appId}`,
    });
    await integrations.create({ orgId, appId, secret });
    return { success: true };
  });
