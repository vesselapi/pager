import { isString } from 'radash';
import { AuthorizationCode } from 'simple-oauth2';

import { OAuth2Config } from './auth';

export type Json =
  | string
  | number
  | boolean
  | { [Key in string]?: Json }
  | Json[]
  | null;

type SimpleOauth2Config = ConstructorParameters<typeof AuthorizationCode>[0];

const toSimpleOauth2Config = (config: OAuth2Config): SimpleOauth2Config => {
  const tokenUrl = new URL(config.tokenUrl);
  const authUrl = new URL(
    isString(config.authUrl) ? config.authUrl : config.authUrl.url,
  );
  return {
    client: {
      id: config.clientId,
      secret: config.clientSecret,
    },
    auth: {
      tokenHost: tokenUrl.origin,
      tokenPath: tokenUrl.pathname,
      authorizeHost: authUrl.origin,
      authorizePath: authUrl.pathname,
    },
    http: {
      headers: {
        'User-Agent': 'Vessel',
      },
    },
    options: {
      authorizationMethod: config.tokenAuth,
      bodyFormat: config.oauthBodyFormat,
      scopeSeparator: config.scopeSeparator,
    },
  };
};

export const makeOauth2Client = () => ({
  authorizeURL: ({
    config,
    scopes,
    redirectUri,
  }: {
    config: OAuth2Config;
    redirectUri: string;
    scopes?: string[];
  }) => {
    if (isString(config.authUrl)) {
      return config.authUrl;
    }
    const client = new AuthorizationCode(toSimpleOauth2Config(config));
    return client.authorizeURL({
      redirect_uri: redirectUri,
      scope: scopes?.join(','),
    });
  },
  exchange: async ({
    config,
    code,
    redirectUri,
    scopes,
  }: {
    config: OAuth2Config;
    code: string;
    redirectUri: string;
    scopes?: string[];
  }): Promise<{
    accessToken: string;
    refreshToken: string | null;
    oauthResponse: Record<string, string | number>;
  }> => {
    const client = new AuthorizationCode(toSimpleOauth2Config(config));
    const accessToken = await client.getToken({
      code,
      redirect_uri: redirectUri,
      scope: scopes?.join(','),
    });
    return {
      accessToken: accessToken.token.access_token as string,
      refreshToken: (accessToken.token.refresh_token as string) ?? null,
      oauthResponse: accessToken.token as Record<string, string | number>,
    };
  },
  refresh: async ({
    config,
    refreshToken,
  }: {
    config: OAuth2Config;
    refreshToken: string;
  }): Promise<{
    accessToken: string;
    refreshToken?: string;
    oauthResponse?: Record<string, unknown>;
  }> => {
    const client = new AuthorizationCode(toSimpleOauth2Config(config));
    const token = client.createToken({
      refresh_token: refreshToken,
    });

    const simpleOAuthToken = await token.refresh();
    return {
      accessToken: simpleOAuthToken.token.access_token as string,
      refreshToken:
        (simpleOAuthToken.token.refresh_token as string) ?? undefined,
      oauthResponse: simpleOAuthToken.token,
    };
  },
});

export type Oauth2Client = ReturnType<typeof makeOauth2Client>;
