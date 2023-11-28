import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { Db, db } from '@vessel/db';
import { APP_ID, Json } from '@vessel/types';

import { env } from '../../../env.mjs';
import { trpc } from '../../middlewares/trpc/common-trpc-hook';
import { useServicesHook } from '../../middlewares/trpc/use-services-hook';
import { Integrations, makeIntegrations } from '../../services/integrations';
import {
  makeOauth2Client,
  Oauth2Client,
} from '../../services/integrations/oauth';

interface Context {
  db: Db;
  integrations: Integrations;
  oauth2Client: Oauth2Client;
}

// NOTE: Ideally I would use zod's passthrough() but it doesn't return the correct typing
const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
const jsonSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]),
);
const args = z
  .object({
    appId: z.enum(APP_ID),
    code: z.string(),
  })
  .and(jsonSchema);

export const integrationOAuthCallback = trpc
  .use(
    useServicesHook<Context>({
      db: () => db,
      integrations: makeIntegrations,
      oauth2Client: makeOauth2Client,
    }),
  )
  .input(args)
  .mutation(async ({ ctx, input }) => {
    const {
      integrations,
      oauth2Client,
      auth: { user },
    } = ctx;
    const { code, appId } = input;
    const integration = integrations.find(appId);

    const { auth } = integration;
    if (auth.type !== 'oauth2') {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Integration provided is not oauth2',
      });
    }

    const oauthResponse = await oauth2Client.exchange({
      config: auth,
      code,
      redirectUri: `${env.VERCEL_URL}/settings/integrations/oauth-callback/${appId}`,
      oauthRequest: input as Record<string, string>,
    });

    const secret = {
      oauthRequest: input,
      oauthResponse,
    };
    await integrations.create({ orgId: user.orgId, appId, secret });
    return { success: true };
  });
