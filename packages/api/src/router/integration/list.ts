import { pick } from 'radash';
import { z } from 'zod';

import { Db, db } from '@vessel/db';
import { APP_ID, AppId } from '@vessel/types';

import { useServicesHook } from '../../middlewares/use-services-hook';
import { Integrations, makeIntegrations } from '../../services/integrations';
import { publicProcedure } from '../../trpc';

interface Context {
  db: Db;
  integrations: Integrations;
}
const input = z.object({
  appId: z
    .string()
    .transform((x) => x as AppId)
    .refine((appId: string) => APP_ID.includes(appId as AppId)),
});

export const integrationConnect = publicProcedure
  .use(
    useServicesHook<Context>({
      db: () => db,
      integrations: makeIntegrations,
    }),
  )
  .input(input)
  .query(({ ctx, input }) => {
    const { integrations, db } = ctx;
    const { appId } = input;
    const integration = integrations.find(appId);

    const getAuth = () => {
      const { auth } = integration;
      if (auth.type === 'oauth2') return pick(auth, ['type', 'authUrl']);
    };

    return {
      display: integration.display,
      auth: getAuth(),
    };
  });
