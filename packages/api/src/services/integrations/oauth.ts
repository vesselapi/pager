import { isFunction, isString } from 'radash';
import { AuthorizationCode } from 'simple-oauth2';

import type { OAuth2Config } from './auth';

type SimpleOauth2Config = ConstructorParameters<typeof AuthorizationCode>[0];

const toSimpleOauth2Config = ({
  config,
  oauthRequest,
}: {
  config: OAuth2Config;
  oauthRequest: Record<string, string>;
}): SimpleOauth2Config => {
  const tokenUrl = isString(config.tokenUrl)
    ? new URL(config.tokenUrl)
    : new URL(config.tokenUrl({ oauthRequest }));
  const authUrl = isString(config.authUrl)
    ? new URL(config.authUrl)
    : new URL(config.authUrl());

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
    const client = new AuthorizationCode(
      toSimpleOauth2Config({ config, oauthRequest: {} }),
    );
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
    oauthRequest,
  }: {
    config: OAuth2Config;
    code: string;
    redirectUri: string;
    scopes?: string[];
    oauthRequest: Record<string, string>;
  }): Promise<{
    accessToken: string;
    refreshToken: string;
    oauthResponse: Record<string, string | number>;
  }> => {
    const client = new AuthorizationCode(
      toSimpleOauth2Config({ config, oauthRequest }),
    );
    const accessToken = await client.getToken({
      code,
      redirect_uri: redirectUri,
      scope: scopes?.join(','),
    });
    return {
      accessToken: accessToken.token.access_token as string,
      refreshToken: accessToken.token.refresh_token as string,
      oauthResponse: accessToken.token as Record<string, string | number>,
    };
  },
  refresh: async ({
    config,
    refreshToken,
    oauthRequest,
  }: {
    config: OAuth2Config;
    refreshToken: string;
    oauthRequest: Record<string, string>;
  }): Promise<{
    accessToken: string;
    refreshToken?: string;
    oauthResponse?: Record<string, unknown>;
  }> => {
    const client = new AuthorizationCode(
      toSimpleOauth2Config({ config, oauthRequest }),
    );
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
