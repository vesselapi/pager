import { z } from 'zod';

import { Db, db } from '@vessel/db';
import { APP_ID, AppId } from '@vessel/types';

import { trpc } from '../../middlewares/trpc/common-trpc-hook';
import { useServicesHook } from '../../middlewares/trpc/use-services-hook';
import { Integrations, makeIntegrations } from '../../services/integrations';
import {
  makeOauth2Client,
  Oauth2Client,
} from '../../services/integrations/oauth';

interface Context {
  db: Db;
  integrations: Integrations;
  oauth2Client: Oauth2Client;
}
const input = z.object({
  appId: z.enum(APP_ID),
  code: z.string(),
});

export const integrationConnect = trpc
  .use(
    useServicesHook<Context>({
      db: () => db,
      integrations: makeIntegrations,
      oauth2Client: makeOauth2Client,
    }),
  )
  .input(input)
  .mutation(async ({ ctx, input }) => {
    const {
      integrations,
      oauth2Client,
      auth: { user },
    } = ctx;
    const { code, appId } = input;
    const integration = integrations.find(appId);

    const { auth } = integration;
    if (auth.type !== 'oauth2') {
      throw new Error('Integration provided is not oauth2');
    }

    const secret = await oauth2Client.exchange({
      config: auth,
      code,
      // TODO: set redirect URI accordingly
      redirectUri: `https://app.vessel.dev/settings/integrations/${appId}`,
    });
    await integrations.create({ orgId: user.organizationId, appId, secret });
    return { success: true };
  });
