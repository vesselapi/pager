import { APIGatewayEvent } from 'aws-lambda';

import { makeAws } from '@vessel/api/src/libs/aws';

export async function main(event: APIGatewayEvent) {
  console.log({ body: event.body });
  const { sqs } = makeAws();
  await sqs.publish({
    topic: sqs.TOPIC.ALERT,
    payload: { test: 1 },
  });
  return { statusCode: 200, body: { success: false } };
}
