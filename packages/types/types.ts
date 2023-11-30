export type Json =
  | string
  | number
  | boolean
  | { [Key in string]?: Json }
  | Json[]
  | null;

export type HttpsUrl = `https://${string}`;
export const HttpsUrlRegex = `htts\:\/\/.+`;

export type AlertId = `v_alert_${string}`;
export const AlertIdRegex = /^v_alert_[a-z0-9]+$/;

export type AlertEventId = `v_alertEvent_${string}`;
export const AlertEventIdRegex = /^v_alertEvent_[a-z0-9]+$/;

export type EscalationPolicyId = `v_escalationPolicy_${string}`;
export const EscalationPolicyIdRegex = /^v_escalationPolicy_[a-z0-9]+$/;

export type EscalationPolicyStepId = `v_escalationPolicyStep_${string}`;
export const EscalationPolicyStepIdRegex = /^v_escalationPolicyStep_[a-z0-9]+$/;

export type OrgId = `v_org_${string}`;
export const OrgIdRegex = /^v_org_[a-z0-9]+$/;

export type UserId = `v_user_${string}`;
export const UserIdRegex = /^v_user_[a-z0-9]+$/;

export type SecretId = `v_secret_${string}_${string}`; // v_secret_{entity}_{suffix}
export const SecretIdRegex = /^v_secret_[a-z0-9]+_[a-z0-9]+$/;

export type IntegrationId = `v_integration_${string}`; // v_integration_{hash}

export type RotationId = `v_rotation_${string}`;
export const RotationIdRegex = /^v_rotation_[a-z0-9]+/;

export type RotationUserId = `v_rotation_user_${string}`;
export const RotationUserIdRegex = /^v_rotation_user_[a-z0-9]+/;

export type ScheduleId = `v_schedule_${string}`;
export const ScheduleIdRegex = /^v_secret_[a-z0-9]+/;

export const IntegrationIdRegex = /^v_integration_[a-z0-9]+$/;

export const APP_ID = ['sentry'] as const;
export type AppId = (typeof APP_ID)[number];

export type ApiTokenId = `v_secret_apiToken_${string}`; // v_secret_apiToken_{hash}

export type ApiToken = `v_apiToken_${string}`; // v_apiToken_{sha256(apiToken)}
export const ApiTokenRegex = /^v_apiToken_[a-z0-9]+_[a-z0-9]+$/;

export type SecretIntegrationId = `v_secret_integration_${string}`;

export type SecretExpoPushTokenId = `v_secret_expoPushToken_${string}`;
export const SecretExpoPushTokenIdRegex = /^v_secret_expoPushToken_[a-z0-9]+$/;

export type SecretIntegrationOAuth = {
  type: 'oauth';
  oauthRequest: Json;
  oauthResponse: Json;
  refreshToken: string;
  accessToken: string;
};

export type SecretIntegration = SecretIntegrationOAuth;
