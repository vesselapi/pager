import { objectify } from 'radash';

import type { Db } from '@vessel/db';
import { db } from '@vessel/db';

import { trpc } from '../../middlewares/trpc/common-trpc-hook';
import { useServicesHook } from '../../middlewares/trpc/use-services-hook';
import type { Integrations } from '../../services/integrations';
import { makeIntegrations } from '../../services/integrations';

interface Context {
  db: Db;
  integrations: Integrations;
}

export const integrationList = trpc
  .use(
    useServicesHook<Context>({
      db: () => db,
      integrations: makeIntegrations,
    }),
  )
  .query(async ({ ctx }) => {
    const { user } = ctx.auth;
    const integrations = ctx.integrations.list();
    const userIntegrations = await ctx.db.integrations.listByOrgId(user.orgId);
    const userIntegrationsByAppId = objectify(userIntegrations, (x) => x.appId);

    return {
      integrations: integrations.map((integration) => ({
        appId: integration.appId,
        ...integration.display,
        authType: integration.auth.type,
        isConnected: !!userIntegrationsByAppId[integration.appId] ?? false,
      })),
    };
  });
