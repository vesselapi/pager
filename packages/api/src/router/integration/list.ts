import { objectify } from 'radash';

import { Db, db } from '@vessel/db';

import { trpc } from '../../middlewares/trpc/common-trpc-hook';
import { useServicesHook } from '../../middlewares/trpc/use-services-hook';
import { Integrations, makeIntegrations } from '../../services/integrations';

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

    const userIntegrations = await ctx.db.integrations.listByOrgId(
      user.organizationId,
    );
    const userIntegrationsByAppId = objectify(userIntegrations, (x) => x.appId);

    return integrations.map((integration) => ({
      ...integration.display,
      authType: integration.auth.type,
      isConnected: !!userIntegrationsByAppId[integration.appId] ?? false,
    }));
  });
