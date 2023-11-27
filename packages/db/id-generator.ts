import crypto from 'crypto';

import type { AlertId, OrgId, UserId } from '@vessel/types';

export const hash = (text: string) => {
  const hash = crypto.createHash('SHA256');
  hash.update(text);
  return hash.digest('hex');
};

export const randomString = () => {
  const uuid = crypto.randomUUID();
  return hash(uuid);
};

export const IdGenerator = {
  alert: (): AlertId => `v_alert_${randomString()}`,
  org: (): OrgId => `v_org_${randomString()}`,
  user: (): UserId => `v_user_${randomString()}`,
};
