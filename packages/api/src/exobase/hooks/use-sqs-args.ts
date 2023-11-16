import type { Handler, Props } from '@exobase/core';
import type { SQSEvent } from 'aws-lambda';
import { sift } from 'radash';

import type { LambdaFramework } from './use-lambda';

type Options<TArgs> = {
  toArgs: (record: any) => TArgs;
};

export async function withSQSArgs<TArgs extends {}>(
  func: Handler,
  options: Options<TArgs>,
  props: Props & { framework: LambdaFramework },
) {
  const event = props.framework.event as SQSEvent;
  const records = sift(
    event.Records.map((r) => (r.body ? JSON.parse(r.body) : null)),
  );
  const wanted = records.filter((r) => r.Event !== 's3:TestEvent');
  for (const record of wanted) {
    await func({
      ...props,
      args: {
        ...props.args,
        ...options.toArgs(record),
      },
    });
  }
}

export const useSQSArgs =
  <Args extends (record: any) => {}>(toArgs: Options<Args>['toArgs']) =>
  (func: Handler) =>
  (props: Props & { framework: LambdaFramework }) =>
    withSQSArgs(func, { toArgs }, props);
