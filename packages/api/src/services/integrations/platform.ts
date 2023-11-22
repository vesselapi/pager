import { AppId } from '@vessel/types';

import { AuthConfig } from './auth';

type Display = {
  name: string;
  logoURI: string;
};

type PlatformParams = {
  auth: AuthConfig;
  display: Display;
};

export type Platform = {
  appId: AppId;
} & PlatformParams;

export const platform = (
  appId: AppId,
  { auth, display }: PlatformParams,
): Platform => {
  return { appId, auth, display };
};
