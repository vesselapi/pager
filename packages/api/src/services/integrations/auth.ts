type HttpsUrl = `https://${string}`;

type OAuth2Params = {
  authUrl: HttpsUrl | { override: true; url: HttpsUrl };
  tokenUrl: HttpsUrl;
  clientId: string;
  clientSecret: string;
  scopeSeparator?: string;
  oauthBodyFormat?: 'form' | 'json';
  tokenAuth?: 'body' | 'header';
};

export type OAuth2Config = {
  type: 'oauth2';
} & Required<OAuth2Params>;

export type AuthConfig = OAuth2Config;

export const auth: {
  oauth2: (params: OAuth2Params) => OAuth2Config;
} = {
  oauth2: (params) => {
    return {
      ...params,
      type: 'oauth2',
      tokenAuth: params.tokenAuth ?? 'body',
      scopeSeparator: params.scopeSeparator ?? ' ',
      oauthBodyFormat: params.oauthBodyFormat ?? 'form',
    };
  },
};
