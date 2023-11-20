import { Props } from '@exobase/core';
import { useJsonBody, useServices } from '@exobase/hooks';
import z from 'zod';

import { vessel } from '@vessel/api/src/exobase/hooks/common-hooks';
import {
  Logger,
  makeLogger,
} from '@vessel/api/src/exobase/services/make-logger';
import { makePubSub, PubSub } from '@vessel/api/src/services/pubsub';

import { insertAlertSchema } from '../../../../packages/db/schema/alert';

const schema = z.object({
  alert: insertAlertSchema.pick({
    title: true,
    status: true,
    metadata: true,
  }),
});

type Args = z.infer<typeof schema>;

type Services = {
  pubsub: PubSub;
  logger: Logger;
};

type Result = {
  success: true;
};

const alert = async ({
  args,
  services,
  framework,
}: Props<Args, Services>): Promise<Result> => {
  const { alert } = args;
  const { pubsub, logger } = services;

  const dbAlert = await pubsub.alert.publish({
    organizationId: '',
    ...alert,
  });
  logger.info('Alert sent to topic');
  return { success: true };
};

export const main = vessel()
  .hook(
    useServices<Services>({
      pubsub: makePubSub(),
      logger: makeLogger,
    }),
  )
  .hook(useJsonBody<Args>(schema))
  .endpoint(alert);
