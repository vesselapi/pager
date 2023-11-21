import { AuthConfig } from './auth';

type Display = {
  name: string;
  logoURI: string;
};

type PlatformParams = {
  auth: AuthConfig;
  display: Display;
};

export type Platform = PlatformParams;

export const platform = ({ auth, display }: PlatformParams): Platform => {
  return { auth, display };
};
