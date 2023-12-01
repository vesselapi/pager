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
  RotationId,
  RotationIdRegex,
  ScheduleId,
  ScheduleIdRegex,
  SecretExpoPushTokenId,
  SecretExpoPushTokenIdRegex,
  SecretId,
  SecretIdRegex,
  SecretIntegrationId,
  SecretIntegrationIdRegex,
  UserId,
  UserIdRegex,
} from './types';

const regexValidator = <T>(regex: RegExp) =>
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
  rotationId: regexValidator<RotationId>(RotationIdRegex),
  scheduleId: regexValidator<ScheduleId>(ScheduleIdRegex),
  secretId: regexValidator(SecretIdRegex).transform((x) => x as SecretId),
  secretIntegrationId: regexValidator<SecretIntegrationId>(
    SecretIntegrationIdRegex,
  ),
  secretExpoPushTokenId: regexValidator(SecretExpoPushTokenIdRegex).transform(
    (x) => x as SecretExpoPushTokenId,
  ),
  userId: regexValidator<UserId>(UserIdRegex),
};
