import { isString, mapValues, shake } from 'radash';
import type { StackContext} from 'sst/constructs';
import { Api, Function, Queue, Topic } from 'sst/constructs';

import { env } from '@vessel/api/env.mjs';

// TODO(@averyyip): It's not ideal that we set our env vars directly on our infra because there could be secrets. Future work to use AWS SSM.
const stackEnv = shake(
  mapValues(
    env as unknown as Record<string, string | number | undefined>,
    (val) => (val && isString(val) ? val : val?.toString()),
  ),
);

export function CoreStack({ stack }: StackContext) {
  const api = new Api(stack, 'WebhookApi', {
    routes: {
      'POST    /webhook': 'src/routes/alert.main',
    },
    defaults: {
      function: {
        environment: stackEnv,
        permissions: ['sns'],
      },
    },
  });

  const alertOncallFn = new Function(stack, 'AlertOncall', {
    runtime: 'nodejs18.x',
    handler: 'src/functions/alert-oncall.main',
    deadLetterQueueEnabled: true,
    environment: stackEnv,
  });

  const alertOncallQueue = new Queue(stack, 'AlertOncallQueue', {
    consumer: alertOncallFn,
  });

  new Topic(stack, 'AlertsTopic', {
    subscribers: {
      subscriber1: alertOncallQueue,
    },
  });
}
