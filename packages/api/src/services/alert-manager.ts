import { db } from '@vessel/db';
import { CreateAlert } from '@vessel/db/schema/alert';
import { makePubSub } from './pubsub';

export const makeAlertManager = () => {
  const create = async (alert: CreateAlert) => {
    const dbAlert = await db.alerts.create(alert);
    const pubsub = makePubSub();
    await pubsub.alert.publish({ id: dbAlert.id });
    return dbAlert;
  };
  return { create };
};

export type AlertManager = ReturnType<typeof makeAlertManager>;
