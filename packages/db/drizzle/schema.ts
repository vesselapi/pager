export const alertSource = pgEnum('alert_source', ['vessel', 'sentry']);
export const status = pgEnum('status', ['CLOSED', 'OPEN', 'ACKED']);
export const appId = pgEnum('app_id', ['sentry']);
export const escalationPolicyStepType = pgEnum('escalation_policy_step_type', [
  'ROTATION',
  'USER',
]);
