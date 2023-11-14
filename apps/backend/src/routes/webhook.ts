import { HttpEvent } from 'aws-lambda';

import { publish, Topic } from '@vessel/api/src/libs/aws';

export async function main(event: HttpEvent) {
  const records: any[] = event.Records;
  console.log(`Message processed: "${records}"`);
  await publish({ topic: Topic.ALERT, payload: { hi: 'test' } });
  return { statusCode: 200, body: { success: false } };
}
