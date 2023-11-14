import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';

import { env } from '../../env.mjs';

const client = new SNSClient();

export const Topic = {
  ALERT: env.AWS_SNS_TOPIC_ALERT_ARN,
};
type Topic = keyof typeof Topic;

const publish = async ({
  topic,
  payload,
}: {
  topic: Topic;
  payload: object;
}) => {
  const params = new PublishCommand({
    TopicArn: topic,
    Message: JSON.stringify(payload),
  });
  await client.send(params);
};

export { publish };
