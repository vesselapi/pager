import type { Props } from '@exobase/core';
import { useServices } from '@exobase/hooks';
import { z } from 'zod';

import { vessel } from '@vessel/api/src/middlewares/exobase/hooks/common-hooks';
import { useSqsArgs } from '@vessel/api/src/middlewares/exobase/hooks/use-sqs-args';
import type { Logger } from '@vessel/api/src/middlewares/exobase/services/make-logger';
import { makeLogger } from '@vessel/api/src/middlewares/exobase/services/make-logger';
import { AlertId, AlertIdRegex } from '@vessel/types';

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
}

const alertOncall = async ({ args, services }: Props<Args, Services>) => {
  const { logger } = services;
  const alert = await db.alerts.find(args.id);
  if (!alert) {
    logger.info({ alertId: args.id }, 'Alert not found');
    throw new Error(`Alert not found for ${args.id}`);
  }
  if (alert.status === 'CLOSED') {
    return;
  }

  // TODO: Add alerting oncall logic
  // - identify the schedule associated with alert
  // - identify what step we are in the escalation policy for the shcedule
  // - find person to alert for the escalation policy
  // - queue to state machine
};
export const main = vessel()
  .hook(
    useServices({
      logger: makeLogger,
    }),
  )
  .hook(useSqsArgs<Args>(schema))
  .endpoint(alertOncall);
