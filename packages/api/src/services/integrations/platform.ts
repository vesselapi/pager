import type { AppId } from '@vessel/types';

import type { AuthConfig } from './auth';

interface Display {
  name: string;
  logoURI: string;
}

interface PlatformParams {
  auth: AuthConfig;
  display: Display;
}

export type Platform = {
  appId: AppId;
} & PlatformParams;

export const platform = (
  appId: AppId,
  { auth, display }: PlatformParams,
): Platform => {
  return { appId, auth, display };
};
