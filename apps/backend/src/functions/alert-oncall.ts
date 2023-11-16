import { Props } from '@exobase/core';
import { useServices } from '@exobase/hooks';
import { z } from 'zod';

import { vessel } from '@vessel/api/src/exobase/hooks/common-hooks';
import { useSqsArgs } from '@vessel/api/src/exobase/hooks/use-sqs-args';
import {
  Logger,
  makeLogger,
} from '@vessel/api/src/exobase/services/make-logger';

const schema = z.object({ a: z.string() });
type Args = z.infer<typeof schema>;

type Services = {
  logger: Logger;
};

const alertOncall = async ({ args, services }: Props<Args, Services>) => {
  const { logger } = services;

  logger.info(args, 'Alert oncall');
};
export const main = vessel()
  .hook(
    useServices({
      logger: makeLogger,
    }),
  )
  .hook(useSqsArgs<Args>(schema))
  .endpoint(alertOncall);
