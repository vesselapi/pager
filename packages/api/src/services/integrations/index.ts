import { db } from '@vessel/db';
import type { AppId, OrgId, SecretIntegration } from '@vessel/types';

import { Json, makeSecretManager } from '../secret-manager';
import { sentry } from './app/sentry';
import type { Platform } from './platform';

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

  const create = async ({
    orgId,
    appId,
    secret,
  }: {
    orgId: OrgId;
    appId: AppId;
    secret: SecretIntegration;
  }) => {
    const integration = find(appId);
    if (integration.auth.type !== 'oauth2') {
      throw new Error('Cannot store credentials because it is not OAuth2');
    }
    const secretManager = makeSecretManager();
    const { id: secretId } = await secretManager.integration.create({
      orgId,
      secret,
    });
    await db.integrations.create({ orgId, appId, secretId });
  };

  return { find, list, create };
};

export type Integrations = ReturnType<typeof makeIntegrations>;
