import { z } from 'zod';

import { Db, db } from '@vessel/db';
import { APP_ID, AppId } from '@vessel/types';

import { useServicesHook } from '../../middlewares/trpc/use-services-hook';
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

export const integrationList = publicProcedure
  .use(
    useServicesHook<Context>({
      db: () => db,
      integrations: makeIntegrations,
    }),
  )
  .input(input)
  .query(({ ctx, input }) => {
    const { integrations } = ctx;
    const { appId } = input;
    const integration = integrations.find(appId);

    return {
      ...integration.display,
      authType: integration.auth.type,
    };
  });
