import type { Props } from '@exobase/core';
import { useJsonBody, useServices } from '@exobase/hooks';
import z from 'zod';

import { vessel } from '@vessel/api/src/middlewares/exobase/hooks/common-hooks';
import {
  ApiTokenAuth,
  useApiTokenAuth,
} from '@vessel/api/src/middlewares/exobase/hooks/use-api-token-auth';

import {
  AlertManager,
  makeAlertManager,
} from '@vessel/api/src/services/alert-manager';
import {
  SecretManager,
  makeSecretManager,
} from '@vessel/api/src/services/secret-manager';
import { insertAlertSchema } from '../../../../packages/db/schema/alert';

const schema = z.object({
  alert: insertAlertSchema.pick({
    title: true,
    status: true,
    metadata: true,
    escalationPolicyId: true,
  }),
});

type Args = z.infer<typeof schema>;

interface Services {
  alertManager: AlertManager;
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
  const { alertManager } = services;

  await alertManager.create({
    orgId: auth.orgId,
    escalationStepState: 0,
    source: 'API',
    ...alert,
  });
  return { success: true };
};

export const main = vessel()
  .hook(
    useServices<Services>({
      alertManager: makeAlertManager(),
      secretManager: makeSecretManager(),
    }),
  )
  .hook(useApiTokenAuth())
  .hook(useJsonBody<Args>(schema))
  .endpoint(alert);
