import { db } from '@vessel/db';
import { AppId, OrgId } from '@vessel/types';

import { Json, makeSecretManager } from '../secret-manager';
import { sentry } from './app/sentry';
import { Platform } from './platform';

const integrations: Record<AppId, Platform> = {
  sentry,
};

export const makeIntegrations = () => {
  const find = (appId: AppId) => {
    if (!integrations[appId]) {
      throw new Error('Invalid integration');
    }
    return integrations[appId];
  };

  const list = () => Object.values(integrations);

  const create = async <T extends Json>({
    orgId,
    appId,
    secret,
  }: {
    orgId: OrgId;
    appId: AppId;
    secret: T;
  }) => {
    const integration = find(appId);
    if (integration.auth.type !== 'oauth2') {
      throw new Error('Cannot store credentials because it is not OAuth2');
    }
    const secretManager = makeSecretManager();
    await secretManager.integration.create({ orgId, appId, secret });
    await db.integrations.create({ organizationId: orgId, appId });
  };

  return { find, list, create };
};

export type Integrations = ReturnType<typeof makeIntegrations>;
