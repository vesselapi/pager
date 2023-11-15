import { Props } from '@exobase/core';
import { useCors, useJsonBody, useServices } from '@exobase/hooks';
import z from 'zod';

import { Aws, makeAws } from '@vessel/api/src/services/aws';
import { Aws, makeAws } from '@vessel/db';
import { insertAlertSchema } from '@vessel/db/schema/alert';

import { vessel } from '../hooks/common-hooks';

const schema = insertAlertSchema.pick({
  title: true,
  metadata: true,
});

type Args = z.infer<typeof schema>;

type Services = {
  aws: Aws;
};

type Result = {
  success: true;
};

const alert = async ({
  args,
  services,
}: Props<Args, Services>): Promise<Result> => {
  const partialAlert = args;
  const { aws, db } = services;
  

  const connections = await db.connections.list({
    cursor,
    projectId,
  });

  return {
    success: true,
  };
};

export default vessel()
  .hook(useCors())
  .hook(useServices<Services>({
    aws: makeAws,
    db: makeDb,
  }))
  .hook(useApiTokenAuth())
  .hook(useUserDomain())
  .hook(useJsonBody<Args>(schema))
  .hook(useEndpointAnalytics('connections.list'))
  .endpoint(listConnection);

// import { APIGatewayEvent } from 'aws-lambda';

// import { makeAws } from '@vessel/api/src/libs/aws';

// export async function main(event: APIGatewayEvent) {
//   console.log({ body: event.body });
//   const { sqs } = makeAws();
//   await sqs.publish({
//     topic: sqs.TOPIC.ALERT,
//     payload: { test: 1 },
//   });
//   return { statusCode: 200, body: { success: false } };
// }
