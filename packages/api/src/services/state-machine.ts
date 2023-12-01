import { SFNClient, StartExecutionCommand } from '@aws-sdk/client-sfn';

const client = new SFNClient({ region: 'REGION' });

export const makeStateMachine = () => {
  const run = async ({
    stateMachineArn,
    input,
  }: {
    stateMachineArn: string;
    input: object;
  }) => {
    const params = new StartExecutionCommand({
      stateMachineArn,
      input: JSON.stringify(input),
    });
    await client.send(params);
  };

  return { run };
};
