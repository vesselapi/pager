import { Props } from '@exobase/core';
import { useJsonBody, useServices } from '@exobase/hooks';
import z from 'zod';

import { vessel } from '@vessel/api/src/exobase/hooks/common-hooks';
import {
  Logger,
  makeLogger,
} from '@vessel/api/src/exobase/services/make-logger';
import { makePubSub, PubSub } from '@vessel/api/src/services/pubsub';

const schema = z.object({});

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
  const { pubsub, logger } = services;

  await pubsub.alert.publish({
    payload: {},
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
