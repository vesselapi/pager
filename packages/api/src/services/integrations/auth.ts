import { z } from 'zod';

import type { HttpsUrl } from '@vessel/types';

interface OAuth2Params<
  TOauthRequest extends z.ZodTypeAny = z.ZodTypeAny,
  TOauthResponse extends z.ZodTypeAny = z.ZodTypeAny,
  TSecret = {
    oauthRequest: z.infer<TOauthRequest>;
    oauthResponse: z.infer<TOauthResponse>;
  },
> {
  oauthRequestSchema?: TOauthRequest;
  oauthResponseSchema?: TOauthResponse;
  authUrl: HttpsUrl | (() => HttpsUrl);
  tokenUrl: HttpsUrl | ((params: TSecret) => HttpsUrl);
  externalId?: (secret: TSecret) => string | null;
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
      oauthResponseSchema: params.oauthResponseSchema ?? z.any(),
      tokenAuth: params.tokenAuth ?? 'body',
      externalId: params.externalId ?? (() => null),
      scopeSeparator: params.scopeSeparator ?? ' ',
      oauthBodyFormat: params.oauthBodyFormat ?? 'form',
    };
  },
};
