import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';

import { Alert } from '@vessel/db/schema/alert';

import { env } from '../../env.mjs';

export const TOPIC = {
  ALERT: env.AWS_SNS_TOPIC_ALERT_ARN,
} as const;
export type Topic = (typeof TOPIC)[keyof typeof TOPIC];

export const makePubSub = () => {
  const client = new SNSClient();

  const pub = async <T>({ topic, payload }: { topic: Topic; payload: T }) => {
    const params = new PublishCommand({
      TopicArn: topic,
      Message: JSON.stringify(payload),
    });
    await client.send(params);
  };

  const makeAlert = () => {
    const publish = async (payload: Alert) => {
      pub({ topic: TOPIC.ALERT, payload });
    };
    return { publish };
  };

  return {
    alert: makeAlert(),
  };
};
export type PubSub = ReturnType<typeof makePubSub>;
