type OAuth2Params = { authUrl: string; tokenUrl: string };

type OAuth2Config = {
  type: 'oauth2';
  authUrl: string;
  tokenUrl: string;
};

export type AuthConfig = OAuth2Config;

export const auth: {
  oauth2: (params: OAuth2Params) => OAuth2Config;
} = {
  oauth2: (params) => {
    return {
      type: 'oauth2',
      authUrl: params.authUrl,
      tokenUrl: params.tokenUrl,
    };
  },
};
