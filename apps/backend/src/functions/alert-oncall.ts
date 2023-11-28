import type { Props } from '@exobase/core';
import { useServices } from '@exobase/hooks';
import { z } from 'zod';

import { vessel } from '@vessel/api/src/middlewares/exobase/hooks/common-hooks';
import { useSqsArgs } from '@vessel/api/src/middlewares/exobase/hooks/use-sqs-args';
import type { Logger } from '@vessel/api/src/middlewares/exobase/services/make-logger';
import { makeLogger } from '@vessel/api/src/middlewares/exobase/services/make-logger';

const schema = z.object({}).passthrough();
type Args = z.infer<typeof schema>;

interface Services {
  logger: Logger;
}

const alertOncall = async ({ args, services }: Props<Args, Services>) => {
  const { logger } = services;

  logger.info({ args }, 'Alert oncall');
};
export const main = vessel()
  .hook(
    useServices({
      logger: makeLogger,
    }),
  )
  .hook(useSqsArgs<Args>(schema))
  .endpoint(alertOncall);
