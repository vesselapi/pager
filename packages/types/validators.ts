import { z } from 'zod';

import {
  AlertEventId,
  AlertEventIdRegex,
  AlertId,
  AlertIdRegex,
  EscalationPolicyId,
  EscalationPolicyIdRegex,
  EscalationPolicyStepId,
  EscalationPolicyStepIdRegex,
  IntegrationId,
  IntegrationIdRegex,
  OrgId,
  OrgIdRegex,
  ScheduleId,
  ScheduleIdRegex,
  ScheduleUserId,
  ScheduleUserIdRegex,
  SecretExpoPushTokenId,
  SecretExpoPushTokenIdRegex,
  SecretId,
  SecretIdRegex,
  SecretIntegrationId,
  SecretIntegrationIdRegex,
  TeamId,
  TeamIdRegex,
  UserId,
  UserIdRegex,
} from './types';

const regexValidator = <T extends string>(regex: RegExp) =>
  z
    .string()
    .regex(regex, `Invalid id, expected format ${regex}`)
    .transform((x) => x as T);

export const customValidators = {
  alertId: regexValidator<AlertId>(AlertIdRegex),
  alertEventId: regexValidator<AlertEventId>(AlertEventIdRegex),
  escalationPolicyId: regexValidator<EscalationPolicyId>(
    EscalationPolicyIdRegex,
  ),
  escalationPolicyStepId: regexValidator<EscalationPolicyStepId>(
    EscalationPolicyStepIdRegex,
  ),
  integrationId: regexValidator<IntegrationId>(IntegrationIdRegex),
  orgId: regexValidator<OrgId>(OrgIdRegex),
  scheduleId: regexValidator<ScheduleId>(ScheduleIdRegex),
  scheduleUserId: regexValidator<ScheduleUserId>(ScheduleUserIdRegex),
  secretId: regexValidator<SecretId>(SecretIdRegex),
  secretIntegrationId: regexValidator<SecretIntegrationId>(
    SecretIntegrationIdRegex,
  ),
  secretExpoPushTokenId: regexValidator<SecretExpoPushTokenId>(
    SecretExpoPushTokenIdRegex,
  ),
  teamId: regexValidator<TeamId>(TeamIdRegex),
  userId: regexValidator<UserId>(UserIdRegex),
};
