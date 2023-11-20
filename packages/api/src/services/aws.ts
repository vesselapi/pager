import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';

import { env } from '../../env.mjs';

const makeSqs = () => {
  const client = new SNSClient();
  const TOPIC = {
    ALERT: env.AWS_SNS_TOPIC_ALERT_ARN,
  } as const;
  type TOPIC = (typeof TOPIC)[keyof typeof TOPIC];

  const publish = async ({
    topic,
    payload,
  }: {
    topic: TOPIC;
    payload: object;
  }) => {
    const params = new PublishCommand({
      TopicArn: topic,
      Message: JSON.stringify(payload),
    });
    await client.send(params);
  };

  return {
    TOPIC,
    publish,
  };
};

export const makeAws = () => {
  return {
    sqs: makeSqs(),
  };
};

export type Aws = ReturnType<typeof makeAws>;
