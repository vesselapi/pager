import { z } from 'zod';

import type { HttpsUrl } from '@vessel/types';

interface OAuth2Params<TOauthRequest extends z.ZodTypeAny = z.ZodTypeAny> {
  oauthRequestSchema?: TOauthRequest;
  authUrl: HttpsUrl | (() => HttpsUrl);
  tokenUrl:
    | HttpsUrl
    | ((params: { oauthRequest: z.infer<TOauthRequest> }) => HttpsUrl);
  clientId: string;
  clientSecret: string;
  scopeSeparator?: string;
  oauthBodyFormat?: 'form' | 'json';
  tokenAuth?: 'body' | 'header';
}

export type OAuth2Config = {
  type: 'oauth2';
} & Required<OAuth2Params>;

export type AuthConfig = OAuth2Config;

export const auth: {
  oauth2: <T extends z.ZodTypeAny>(params: OAuth2Params<T>) => OAuth2Config;
} = {
  oauth2: (params) => {
    return {
      ...params,
      type: 'oauth2',
      oauthRequestSchema: params.oauthRequestSchema ?? z.any(),
      tokenAuth: params.tokenAuth ?? 'body',
      scopeSeparator: params.scopeSeparator ?? ' ',
      oauthBodyFormat: params.oauthBodyFormat ?? 'form',
    };
  },
};
