import crypto from 'crypto';

import type {
  AlertEventId,
  AlertId,
  ApiToken,
  ApiTokenId,
  EscalationPolicyId,
  EscalationPolicyStepId,
  IntegrationId,
  OrgId,
  ScheduleId,
  ScheduleUserId,
  SecretExpoPushTokenId,
  SecretIntegrationId,
  TeamId,
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
  alertEvent: (): AlertEventId => `v_alertEvent_${randomString()}`,
  apiToken: (apiToken: ApiToken): ApiTokenId =>
    `v_secret_apiToken_${hash(apiToken)}`,
  escalationPolicy: (): EscalationPolicyId =>
    `v_escalationPolicy_${randomString()}`,
  escalationPolicyStep: (): EscalationPolicyStepId =>
    `v_escalationPolicyStep_${randomString()}`,
  org: (): OrgId => `v_org_${randomString()}`,
  integration: (): IntegrationId => `v_integration_${randomString()}`,
  schedule: (): ScheduleId => `v_schedule_${randomString()}`,
  scheduleUser: (): ScheduleUserId => `v_scheduleUser_${randomString()}`,
  secrets: {
    integration: (): SecretIntegrationId =>
      `v_secret_integration_${randomString()}`,
    expoPushToken: (): SecretExpoPushTokenId =>
      `v_secret_expoPushToken_${randomString()}`,
  },
  team: (): TeamId => `v_team_${randomString()}`,
  user: (): UserId => `v_user_${randomString()}`,
};
