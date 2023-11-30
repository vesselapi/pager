import { Json } from '@vessel/types';

export interface SentryWebhookHeaders {
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

export type BaseSentryPayload = {
  installation: { uuid: string }; // Corresponds to the installation id in the oauth request when a user connects sentry.
  actor:
    | { type: 'user'; id: string; name: string }
    | { type: 'application'; id: string; name: string }
    | { type: 'application'; id: 'sentry'; name: 'Sentry' };
};

// NOTE: sentry-hook-resource = event_alert
// Sample payload: https://docs.sentry.io/product/integrations/integration-platform/webhooks/issue-alerts/#payload
export type SentryWebhookEventAlertBody = BaseSentryPayload & {
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

export type SentryWebhookBody = SentryWebhookEventAlertBody;
