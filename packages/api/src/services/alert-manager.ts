import { db } from '@vessel/db';
import { CreateAlert } from '@vessel/db/schema/alert';
import { AlertId } from '@vessel/types';
import { env } from '../../env.mjs';
import { makePubSub } from './pubsub';
import { makeStateMachine } from './state-machine';

export const makeAlertManager = () => {
  const stateMachine = makeStateMachine();

  const create = async (alert: CreateAlert) => {
    const dbAlert = await db.alerts.create(alert);
    const pubsub = makePubSub();
    await pubsub.alert.publish({ id: dbAlert.id });
    return dbAlert;
  };

  const schedulePage = async ({
    waitSeconds,
    id,
  }: {
    waitSeconds: number;
    id: AlertId;
  }) => {
    await stateMachine.run({
      stateMachineArn: env.AWS_SFN_ALERT_PAGE_ARN,
      input: { waitSeconds, payload: { id } },
    });
  };

  return { create, schedulePage };
};

export type AlertManager = ReturnType<typeof makeAlertManager>;
