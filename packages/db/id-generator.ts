import crypto from 'crypto';

import { AlertId } from '@vessel/types';

const randomString = () => {
  const hash = crypto.createHash('SHA256');
  const uuid = crypto.randomUUID();
  hash.update(uuid);
  return hash.digest('hex');
};

export const IdGenerator = {
  alert: (): AlertId => `v_alert_${randomString()}`,
};
