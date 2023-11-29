export type AlertId = `v_alert_${string}`;
export const AlertIdRegex = /^v_alert_[a-z0-9]+$/;

export type AlertEventId = `v_alertEvent_${string}`;
export const AlertEventIdRegex = /^v_alertEvent_[a-z0-9]+$/;

export type OrgId = `v_org_${string}`;
export const OrgIdRegex = /^v_org_[a-z0-9]+$/;

export type UserId = `v_user_${string}`;
export const UserIdRegex = /^v_user_[a-z0-9]+$/;

export type SecretId = `v_secret_${string}_${string}`; // v_secret_{entity}_{suffix}
export const SecretIdRegex = /^v_secret_[a-z0-9]+_[a-z0-9]+$/;

export type RotationId = `v_rotation_${string}`;
export const RotationIdRegex = /^v_rotation_[a-z0-9]+/;

export type RotationUserId = `v_rotation_user_${string}`;
export const RotationUserIdRegex = /^v_rotation_user_[a-z0-9]+/;

export type ScheduleId = `v_schedule_${string}`;
export const ScheduleIdRegex = /^v_secret_[a-z0-9]+/;

export type IntegrationId = `v_integration_${string}_${string}`; // v_integration_{orgId}_{appId}
export const IntegrationIdRegex = /^v_integration_[a-z0-9]+$/;

export const APP_ID = ['sentry'] as const;
export type AppId = (typeof APP_ID)[number];

export type ApiTokenId = `v_secret_apiToken_${string}`; // v_secret_apiToken_{hash}

export type ApiToken = `v_apiToken_${string}`; // v_apiToken_{sha256(apiToken)}
export const ApiTokenRegex = /^v_apiToken_[a-z0-9]+_[a-z0-9]+$/;

export type SecretIntegrationId = `v_secret_integration_${string}`;
