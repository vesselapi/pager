import type { Props } from '@exobase/core';
import { useServices } from '@exobase/hooks';
import { z } from 'zod';

import { vessel } from '@vessel/api/src/middlewares/exobase/hooks/common-hooks';
import { useSqsArgs } from '@vessel/api/src/middlewares/exobase/hooks/use-sqs-args';
import type { Logger } from '@vessel/api/src/middlewares/exobase/services/make-logger';
import { makeLogger } from '@vessel/api/src/middlewares/exobase/services/make-logger';
import type { AlertId } from '@vessel/types';
import { AlertIdRegex } from '@vessel/types';

import type { AlertManager } from '@vessel/api/src/services/alert-manager';
import { makeAlertManager } from '@vessel/api/src/services/alert-manager';
import type { Db } from '../../../../packages/db';
import { db } from '../../../../packages/db';

const schema = z.object({
  id: z
    .string()
    .regex(AlertIdRegex)
    .transform((id) => id as AlertId),
});
type Args = z.infer<typeof schema>;

interface Services {
  logger: Logger;
  db: Db;
  alertManager: AlertManager;
}

const alertPage = async ({ args, services }: Props<Args, Services>) => {
  const { logger, db, alertManager } = services;
  const dbAlert = await db.alerts.findWithEscalationPolicy(args.id);
  if (!dbAlert) {
    logger.info({ alertId: args.id }, 'Alert not found');
    throw new Error(`Alert not found for ${args.id}`);
  }

  const { alert, escalationPolicy, escalationPolicySteps } = dbAlert;

  if (alert.status !== 'OPEN' || !alert.escalationPolicyId) {
    return;
  }

  const currentStep = escalationPolicySteps.find(
    (step) => step.order === alert.escalationStepState,
  );
  if (!currentStep) {
    throw new Error(
      `Escalation policy step not found for ${alert.id} ${escalationPolicy.id} order=${alert.escalationStepState}`,
    );
  }

  // NOTE: Alert according to step type
  if (currentStep.type === 'USER') {
    // TODO: Add logic to look up user and page
    logger.info(
      { alertId: alert.id, userId: currentStep.userId },
      'Alert user',
    );
  } else if (currentStep.type === 'SCHEDULE') {
    // TODO: Add logic to look up the user associated with the schedule
    logger.info(
      { alertId: alert.id, scheduleId: currentStep.scheduleId },
      'Alert schedule',
    );
  }

  // NOTE: Increment step state of alert
  const newEscalationStepState = alert.escalationStepState + 1;
  await db.alerts.update(alert.id, {
    escalationStepState: newEscalationStepState,
  });

  // NOTE: Exit if we've exhausted all of the steps for escalation policy
  if (newEscalationStepState === escalationPolicySteps.length) {
    return;
  }

  await alertManager.schedulePage({
    waitSeconds: currentStep.nextStepInSeconds,
    id: alert.id,
  });
};

export const main = vessel()
  .hook(
    useServices({
      logger: makeLogger,
      db: () => db,
      alertManager: makeAlertManager,
    }),
  )
  .hook(useSqsArgs<Args>(schema))
  .endpoint(alertPage);
