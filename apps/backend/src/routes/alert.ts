import { Props } from '@exobase/core';
import { useJsonBody, useServices } from '@exobase/hooks';
import z from 'zod';

import { Aws, makeAws } from '@vessel/api/src/services/aws';

import { vessel } from '../hooks/common-hooks';

const schema = z.object({});

type Args = z.infer<typeof schema>;

type Services = {
  aws: Aws;
};

type Result = {
  success: true;
};

const alert = async ({
  args,
  services,
  framework,
}: Props<Args, Services>): Promise<Result> => {
  console.log({ args, framework });

  const {
    aws: { sqs },
  } = services;

  await sqs.publish({
    topic: sqs.TOPIC.ALERT,
    payload: { test: '1' },
  });
  return { success: true };
};

export const main = vessel()
  .hook(
    useServices<Services>({
      aws: makeAws,
    }),
  )
  .hook(useJsonBody<Args>(schema))
  .endpoint(alert);
