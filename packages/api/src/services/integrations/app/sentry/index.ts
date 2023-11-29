import { z } from 'zod';

import type { HttpsUrl } from '@vessel/types';

import { env } from '../../../../../env.mjs';
import { auth } from '../../auth';
import { platform } from '../../platform';
import { SENTRY_URI } from './logo';

export const sentry = platform('sentry', {
  auth: auth.oauth2({
    authUrl: env.INTEGRATION_SENTRY_INSTALL_URL as HttpsUrl,
    oauthRequestSchema: z.object({
      installationId: z.string(),
    }),
    tokenUrl: ({ oauthRequest }) =>
      `https://sentry.io/api/0/sentry-app-installations/${oauthRequest.installationId}/authorizations/`,
    externalId: ({ oauthResponse }) => oauthResponse.installationId,
    clientId: env.INTEGRATION_SENTRY_CLIENT_ID,
    clientSecret: env.INTEGRATION_SENTRY_SECRET,
    oauthBodyFormat: 'json',
  }),
  display: {
    name: 'Sentry',
    logoURI: SENTRY_URI,
  },
});
