import type { Props } from '@exobase/core';
import { useJsonBody, useServices } from '@exobase/hooks';
import z from 'zod';

import { vessel } from '@vessel/api/src/middlewares/exobase/hooks/common-hooks';
import type { ApiTokenAuth } from '@vessel/api/src/middlewares/exobase/hooks/use-api-token-auth';
import { useApiTokenAuth } from '@vessel/api/src/middlewares/exobase/hooks/use-api-token-auth';
import type { PubSub } from '@vessel/api/src/services/pubsub';
import { makePubSub } from '@vessel/api/src/services/pubsub';
import type { SecretManager } from '@vessel/api/src/services/secret-manager';
import { makeSecretManager } from '@vessel/api/src/services/secret-manager';

import { db } from '../../../../packages/db';
import { insertAlertSchema } from '../../../../packages/db/schema/alert';

const schema = z.object({
  alert: insertAlertSchema.pick({
    title: true,
    status: true,
    metadata: true,
  }),
});

type Args = z.infer<typeof schema>;

interface Services {
  pubsub: PubSub;
  secretManager: SecretManager;
}

interface Result {
  success: true;
}

const alert = async ({
  args,
  services,
  auth,
}: Props<Args, Services, ApiTokenAuth>): Promise<Result> => {
  const { alert } = args;
  const { pubsub } = services;

  const dbAlert = await db.alerts.create({
    orgId: auth.orgId,
    ...alert,
  });
  await pubsub.alert.publish(dbAlert);
  return { success: true };
};

export const main = vessel()
  .hook(
    useServices<Services>({
      pubsub: makePubSub(),
      secretManager: makeSecretManager(),
    }),
  )
  .hook(useApiTokenAuth())
  .hook(useJsonBody<Args>(schema))
  .endpoint(alert);
