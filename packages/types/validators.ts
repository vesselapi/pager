import { z } from 'zod';

import {
  EscalationPolicyId,
  EscalationPolicyIdRegex,
  EscalationPolicyStepId,
  EscalationPolicyStepIdRegex,
  OrgId,
  OrgIdRegex,
  RotationId,
  RotationIdRegex,
  ScheduleId,
  ScheduleIdRegex,
  UserId,
  UserIdRegex,
} from './types';

const regexValidator = (regex: RegExp) =>
  z.string().regex(regex, `Invalid id, expected format ${regex}`);

export const customValidators = {
  escalationPolicyId: regexValidator(EscalationPolicyIdRegex).transform(
    (x) => x as EscalationPolicyId,
  ),
  escalationPolicyStepId: regexValidator(EscalationPolicyStepIdRegex).transform(
    (x) => x as EscalationPolicyStepId,
  ),
  orgId: regexValidator(OrgIdRegex).transform((x) => x as OrgId),
  rotationId: regexValidator(RotationIdRegex).transform((x) => x as RotationId),
  scheduleId: regexValidator(ScheduleIdRegex).transform((x) => x as ScheduleId),
  userId: regexValidator(UserIdRegex).transform((x) => x as UserId),
};
