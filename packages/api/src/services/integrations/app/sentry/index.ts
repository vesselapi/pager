import { env } from '../../../../../env.mjs';
import { auth } from '../../auth';
import { platform } from '../../platform';
import { SENTRY_URI } from './logo';

export const sentry = platform('sentry', {
  auth: auth.oauth2({
    authUrl: {
      url: 'https://sentry.io/sentry-apps/vessel/external-install/',
      override: true,
    },
    tokenUrl:
      'https://sentry.io/api/0/sentry-app-installations/{}/authorizations/',
    clientId: env.INTEGRATION_SENTRY_CLIENT_ID,
    clientSecret: env.INTEGRATION_SENTRY_SECRET,
  }),
  display: {
    name: 'Sentry',
    logoURI: SENTRY_URI,
  },
});