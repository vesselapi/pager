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
