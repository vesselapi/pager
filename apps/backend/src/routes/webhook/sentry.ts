import { NotAuthenticatedError, type Props } from '@exobase/core';
import { useJsonBody, useServices } from '@exobase/hooks';
import {
  Logger,
  makeLogger,
} from '@vessel/api/src/middlewares/exobase/services/make-logger';
import {
  Integrations,
  makeIntegrations,
} from '@vessel/api/src/services/integrations';
import type {
  SentryWebhookBody,
  SentryWebhookHeaders,
  SentryWebhookIssueCreateBody,
} from '@vessel/api/src/services/integrations/app/sentry/types';
import * as crypto from 'crypto';

import { vessel } from '@vessel/api/src/middlewares/exobase/hooks/common-hooks';
import {
  AlertManager,
  makeAlertManager,
} from '@vessel/api/src/services/alert-manager';

import { z } from 'zod';
import { Db, db } from '../../../../../packages/db';

interface Services {
  db: Db;
  integrations: Integrations;
  alertManager: AlertManager;
  logger: Logger;
}

interface Result {
  success: true;
}

const sentryWebhook = async ({
  args,
  services,
  request,
}: Props<SentryWebhookBody, Services>): Promise<Result> => {
  const headers = request.headers as unknown as SentryWebhookHeaders;
  const { db, integrations, alertManager, logger } = services;

  logger.info({ args });
  if (['installation'].includes(headers['sentry-hook-resource'])) {
    return { success: true };
  }

  const integration = integrations.find('sentry');

  const verifySignature = () => {
    const hmac = crypto.createHmac('sha256', integration.auth.clientSecret);
    hmac.update(JSON.stringify(request.body), 'utf8');
    const digest = hmac.digest('hex');
    return digest === headers['sentry-hook-signature'];
  };

  if (!verifySignature()) {
    throw new NotAuthenticatedError('Signature mismatch for sentry webhook', {
      key: 'sentry.webhook',
    });
  }

  const dbIntegration = await db.integrations.findByExternalId({
    appId: 'sentry',
    externalId: args.installation.uuid,
  });
  if (!dbIntegration) {
    throw new NotAuthenticatedError(
      `Sentry installation not found for ${args.installation.uuid}`,
      { key: 'sentry.webhook' },
    );
  }

  if (headers['sentry-hook-resource'] === 'issue') {
    const body = args as SentryWebhookIssueCreateBody;
    await alertManager.create({
      title: body.data.issue.title,
      orgId: dbIntegration.orgId,
      status: 'OPEN',
      source: 'sentry',
      escalationPolicyId: dbIntegration.escalationPolicyId,
      metadata: {
        headers,
        body,
      } as any,
    });
  }

  return { success: true };
};

export const main = vessel()
  .hook(
    useServices<Services>({
      db: () => db,
      integrations: makeIntegrations(),
      alertManager: makeAlertManager(),
      logger: makeLogger,
    }),
  )
  .hook(useJsonBody<SentryWebhookBody>(z.object({}).passthrough()))
  .endpoint(sentryWebhook);
