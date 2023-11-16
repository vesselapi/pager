import { Props } from '@exobase/core';
import { useJsonBody, useServices } from '@exobase/hooks';
import z from 'zod';

import { vessel } from '@vessel/api/src/exobase/hooks/common-hooks';
import {
  Logger,
  makeLogger,
} from '@vessel/api/src/exobase/services/make-logger';
import { Aws, makeAws } from '@vessel/api/src/services/aws';

const schema = z.object({});

type Args = z.infer<typeof schema>;

type Services = {
  aws: Aws;
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
  const {
    aws: { sqs },
    logger,
  } = services;

  await sqs.publish({
    topic: sqs.TOPIC.ALERT,
    payload: { test: '1' },
  });
  logger.info('Alert sent to topic');
  return { success: true };
};

export const main = vessel()
  .hook(
    useServices<Services>({
      aws: makeAws,
      logger: makeLogger,
    }),
  )
  .hook(useJsonBody<Args>(schema))
  .endpoint(alert);
