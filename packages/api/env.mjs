import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  shared: {
    VERCEL_URL: z
      .string()
      .optional()
      .transform((v) => (v ? `https://${v}` : 'localhost:3000')),
  },
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app isn't
   * built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url(),
    DATABASE_SECRET_STORE_KEY: z.string(),
    CLERK_SECRET_KEY: z.string(),
    AWS_SNS_TOPIC_ALERT_ARN: z.string(),
    AWS_SFN_ALERT_PAGE_ARN: z.string(),
    TWILIO_ACCOUNT_SID: z.string(),
    TWILIO_AUTH_TOKEN: z.string(),
    TWILIO_PHONE_NUMBER: z.string(),
    RESEND_API_KEY: z.string(),
    INTEGRATION_SENTRY_CLIENT_ID: z.string(),
    INTEGRATION_SENTRY_SECRET: z.string(),
    INTEGRATION_SENTRY_INSTALL_URL: z.string(),
    S3_URL: z.string().url(),
    S3_BUCKET: z.string(),
    S3_ACCESS_KEY_ID: z.string(),
    S3_SECRET_ACCESS_KEY: z.string(),
  },
  /**
   * Specify your client-side environment variables schema here.
   * For them to be exposed to the client, prefix them with `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
  },
  /**
   * Destructure all variables from `process.env` to make sure they aren't tree-shaken away.
   */
  runtimeEnv: {
    VERCEL_URL: process.env.VERCEL_URL,
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_SECRET_STORE_KEY: process.env.DATABASE_SECRET_STORE_KEY,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    AWS_SNS_TOPIC_ALERT_ARN: process.env.AWS_SNS_TOPIC_ALERT_ARN,
    AWS_SFN_ALERT_PAGE_ARN: process.env.AWS_SFN_ALERT_PAGE_ARN,
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    INTEGRATION_SENTRY_CLIENT_ID: process.env.INTEGRATION_SENTRY_CLIENT_ID,
    INTEGRATION_SENTRY_SECRET: process.env.INTEGRATION_SENTRY_SECRET,
    INTEGRATION_SENTRY_INSTALL_URL: process.env.INTEGRATION_SENTRY_INSTALL_URL,
    S3_URL: process.env.S3_URL,
    S3_BUCKET: process.env.S3_BUCKET,
    S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID,
    S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
    // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
  },
  skipValidation:
    !!process.env.CI ||
    !!process.env.SKIP_ENV_VALIDATION ||
    process.env.npm_lifecycle_event === 'lint',
});
