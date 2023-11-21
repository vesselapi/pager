import { AppId } from '@vessel/types';

import { sentry } from './app/sentry';
import { Platform } from './platform';

const integrations: Record<AppId, Platform> = {
  sentry,
};

export const makeIntegrations = () => {
  const find = (appId: AppId) => {
    if (!integrations[appId]) {
      throw new Error('Invalid integration');
    }
    return integrations[appId];
  };

  const list = () => Object.values(integrations);

  return { find, list };
};

export type Integrations = ReturnType<typeof makeIntegrations>;
