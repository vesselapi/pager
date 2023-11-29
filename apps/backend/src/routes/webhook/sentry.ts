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
import * as crypto from 'crypto';

import { vessel } from '@vessel/api/src/middlewares/exobase/hooks/common-hooks';
import {
  AlertManager,
  makeAlertManager,
} from '@vessel/api/src/services/alert-manager';

import { Json } from '@vessel/types';
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

interface SentryWebhookHeaders {
  'sentry-hook-resource':
    | 'installation'
    | 'event_alert' // Corresponds to new issue alert
    | 'issue'
    | 'metric_alert'
    | 'error'
    | 'comment';
  'sentry-hook-timestamp': string;
  'sentry-hook-signature': string;
}

type BaseSentryPayload = {
  installation: { uuid: string }; // Corresponds to the installation id in the oauth request when a user connects sentry.
  actor:
    | { type: 'user'; id: string; name: string }
    | { type: 'application'; id: string; name: string }
    | { type: 'application'; id: 'sentry'; name: 'Sentry' };
};

// NOTE: sentry-hook-resource = event_alert
// Sample payload: https://docs.sentry.io/product/integrations/integration-platform/webhooks/issue-alerts/#payload
type SentryEventAlertPayload = BaseSentryPayload & {
  action: 'triggered';
  data: {
    event: {
      url: string;
      web_url: string;
      issue_url: string;
      issue_id: string;
      contexts: {
        [browserName: string]: {
          name: string;
          type: string;
          version: string;
        };
      };
      culprit: string;
      datetime: string;
      event_id: string;
      exception: {
        values: {
          mechanism: {
            data: { message: string; mode: string; name: string };
            description?: string;
            handled: boolean;
            help_link?: string;
            type: string;
          };
          stacktrace: {
            frames: {
              abs_path: string;
              colno: number;
              context_line: string;
              data: object;
              filename: string;
              lineno: number;
              module: string;
            }[];
          };
          type: string;
          value: string;
        }[];
      };
    } & Json;
    issue_id: string;
    key_id: string;
    level: string;
    metadata: {
      filename: string;
      type: string;
      value: String;
    };
    platform: string;
    project: number;
    request: {
      cookies?: unknown;
      data?: unknown;
      env?: unknown;
      fragment?: unknown;
      headers: [key: string, value: string][];
    };
    sdk: {
      integrations: string[];
      name: string;
      packages: { name: string; version: string }[];
      version: string;
    };
    tags: [key: string, value: string][];
    timestamp: number;
    type: string;
    user: {
      ip_address: string;
    };
    version: string;
  };
  triggered_rule: string;
  issue_alert: {
    title: string;
    settings: { name: string; value: string }[];
  };
};

type SentryPayload = SentryEventAlertPayload;

const sentryWebhook = async ({
  args,
  services,
  request,
}: Props<SentryPayload, Services>): Promise<Result> => {
  const headers = request.headers as unknown as SentryWebhookHeaders;
  const { db, integrations, alertManager, logger } = services;

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

  // Get secret for integration
  // Run verify webhook
  // create and send out to SNS
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

  if (headers['sentry-hook-resource'] === 'event_alert') {
    const body = args as SentryEventAlertPayload;
    await alertManager.create({
      title: body.issue_alert.title,
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
  .hook(useJsonBody<SentryPayload>(z.object({}).passthrough()))
  .endpoint(sentryWebhook);
