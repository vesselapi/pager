import type { Props } from '@exobase/core';
import { useJsonBody, useServices } from '@exobase/hooks';
import z from 'zod';

import { vessel } from '@vessel/api/src/middlewares/exobase/hooks/common-hooks';

import {
  AlertManager,
  makeAlertManager,
} from '@vessel/api/src/services/alert-manager';
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
}

interface Result {
  success: true;
}

const alert = async ({
  args,
  services,
  auth,
}: Props<Args, Services>): Promise<Result> => {
  // ApiTokenAuth
  const { alert } = args;
  const { alertManager } = services;

  await alertManager.create({
    orgId:
      'v_org_52da59af2929d33c0d591d28381b9a4fd80a2b13acdaabd9108c7771a5314913', //auth.orgId,
    escalationStepState: 0,
    source: 'vessel',
    ...alert,
  });
  return { success: true };
};

export const main = vessel()
  .hook(
    useServices<Services>({
      alertManager: makeAlertManager(),
    }),
  )
  // .hook(useApiTokenAuth())
  .hook(useJsonBody<Args>(schema))
  .endpoint(alert);
