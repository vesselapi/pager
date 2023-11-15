import { SQSEvent } from 'aws-lambda';
import { z } from 'zod';

const schema = z.any();
type Args = z.infer<typeof schema>;

async function alertOncall(args: Args) {
  console.log(`Message processed: "${JSON.stringify(args)}"`);
}

export const main = async (event: SQSEvent) => {
  for (const record of event.Records) {
    const args = schema.parse(record);
    await alertOncall(args);
  }
};
