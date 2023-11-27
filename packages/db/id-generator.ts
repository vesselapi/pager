import crypto from 'crypto';

import {
  AlertId,
  ApiToken,
  ApiTokenId,
  AppId,
  IntegrationId,
  OrgId,
  SecretIntegrationId,
  UserId,
} from '@vessel/types';

export const hash = (text: string) => {
  const hash = crypto.createHash('SHA256');
  hash.update(text);
  return hash.digest('hex');
};

export const randomString = () => {
  const uuid = crypto.randomUUID();
  return hash(uuid);
};

export const IdGenerator = {
  alert: (): AlertId => `v_alert_${randomString()}`,
  apiToken: (apiToken: ApiToken): ApiTokenId =>
    `v_secret_apiToken_${hash(apiToken)}`,
  integration: ({
    orgId,
    appId,
  }: {
    orgId: OrgId;
    appId: AppId;
  }): IntegrationId => `v_integration_${orgId}_${appId}`,
  secrets: {
    integration: ({
      orgId,
      appId,
    }: {
      orgId: OrgId;
      appId: AppId;
    }): SecretIntegrationId => `v_secret_integration_${orgId}_${appId}`,
  },
  org: (): OrgId => `v_org_${randomString()}`,
  user: (): UserId => `v_user_${randomString()}`,
};
