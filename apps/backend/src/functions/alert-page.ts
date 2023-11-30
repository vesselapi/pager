import type { Props } from '@exobase/core';
import { useServices } from '@exobase/hooks';
import { z } from 'zod';

import { vessel } from '@vessel/api/src/middlewares/exobase/hooks/common-hooks';
import { useSqsArgs } from '@vessel/api/src/middlewares/exobase/hooks/use-sqs-args';
import type { Logger } from '@vessel/api/src/middlewares/exobase/services/make-logger';
import { makeLogger } from '@vessel/api/src/middlewares/exobase/services/make-logger';
import { AlertId, AlertIdRegex } from '@vessel/types';

import {
  AlertManager,
  makeAlertManager,
} from '@vessel/api/src/services/alert-manager';
import { Db, db } from '../../../../packages/db';

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

const alertOncall = async ({ args, services }: Props<Args, Services>) => {
  const { logger, db, alertManager } = services;
  const alert = await db.alerts.find(args.id);
  if (!alert) {
    logger.info({ alertId: args.id }, 'Alert not found');
    throw new Error(`Alert not found for ${args.id}`);
  }
  if (alert.status === 'CLOSED' || !alert.escalationPolicyId) {
    return;
  }

  const escalationPolicy = await db.escalationPolicy.findWithSteps(
    alert.escalationPolicyId,
  );

  const currentStep = escalationPolicy.steps.find(
    (step) => step.order === alert.escalationStepState,
  );
  if (!currentStep) {
    throw new Error(
      `Escalation policy step not found for ${alert.id} ${escalationPolicy.id} order=${alert.escalationStepState}`,
    );
  }

  // Alert according to step
  if (currentStep.type === 'USER') {
    // alert user
  } else if (currentStep.type === 'ROTATION') {
    // alert rotation
  }

  // Increment step state of alert
  const newEscalationStepState = alert.escalationStepState + 1;
  await db.alerts.update(alert.id, {
    escalationStepState: newEscalationStepState,
  });

  // Exit if we've exhausted all of the steps for escalation policy
  if (newEscalationStepState === escalationPolicy.steps.length) {
    return;
  }

  await alertManager.schedulePage({
    waitSeconds: currentStep.nextStepInSeconds,
    id: alert.id,
  });
};

// TODO: Add alerting oncall logic
// - identify the schedule associated with alert
// - identify what step we are in the escalation policy for the shcedule
// - find person to alert for the escalation policy
// - queue to state machine

export const main = vessel()
  .hook(
    useServices({
      logger: makeLogger,
      db: () => db,
      alertManager: makeAlertManager,
    }),
  )
  .hook(useSqsArgs<Args>(schema))
  .endpoint(alertOncall);
