import {
  Api,
  EventBus,
  Function,
  Queue,
  StackContext,
  Topic,
} from 'sst/constructs';

export function CoreStack({ stack }: StackContext) {
  const api = new Api(stack, 'WebhookApi', {
    routes: {
      'POST    /webhook': 'src/routes/webhook.main',
    },
  });

  const alertOncallFn = new Function(stack, 'AlertOncall', {
    runtime: 'nodejs18.x',
    handler: 'src/functions/alert-oncall.main',
    deadLetterQueueEnabled: true,
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
