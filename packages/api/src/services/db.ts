import { db, schema } from '@vessel/db';

const makeAlert = () => {
  type CreateAlert = Pick<
    typeof schema.alert.$inferInsert,
    'title' | 'metadata'
  >;

  const createAlertId = () => `v_alert_${}`
  const create = (alert: CreateAlert) => {
    db.insert(schema.alert).values({
        ...alert,
        id: ``
    })
  };
};

const makeDb = () => {};
