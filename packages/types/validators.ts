import { z } from 'zod';

import {
  EscalationPolicyId,
  EscalationPolicyIdRegex,
  EscalationPolicyStepId,
  EscalationPolicyStepIdRegex,
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
  escalationPolicyId: regexValidator<EscalationPolicyId>(
    EscalationPolicyIdRegex,
  ),
  escalationPolicyStepId: regexValidator<EscalationPolicyStepId>(
    EscalationPolicyStepIdRegex,
  ),
  orgId: regexValidator<OrgId>(OrgIdRegex),
  scheduleId: regexValidator<ScheduleId>(ScheduleIdRegex),
  scheduleUserId: regexValidator<ScheduleUserId>(ScheduleUserIdRegex),
  secretId: regexValidator<SecretId>(SecretIdRegex),
  secretExpoPushTokenId: regexValidator<SecretExpoPushTokenId>(
    SecretExpoPushTokenIdRegex,
  ),
  teamId: regexValidator<TeamId>(TeamIdRegex),
  userId: regexValidator<UserId>(UserIdRegex),
};
