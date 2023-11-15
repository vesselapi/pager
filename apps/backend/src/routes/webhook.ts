import { APIGatewayEvent } from 'aws-lambda';

import { publish, Topic } from '@vessel/api/src/libs/aws';

export async function main(event: APIGatewayEvent) {
  console.log({ body: event.body });
  await publish({
    topic: Topic.ALERT,
    payload: { test: 1 },
  });
  return { statusCode: 200, body: { success: false } };
}
