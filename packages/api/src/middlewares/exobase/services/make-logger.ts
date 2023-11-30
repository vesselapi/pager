import type { Props, Request } from '@exobase/core';
import * as crypto from 'crypto';

import { logger } from '../../trpc/use-logger';
import type { LambdaFramework } from '../hooks/use-lambda';

export type { Logger } from '../../trpc/use-logger';

const createLogger = <T>(ctx: T) => {
  const id = crypto.randomUUID();
  return logger.child({
    id,
    ...ctx,
  });
};

const makeRequestLogger = <
  TArgs extends {} = {},
  TServices extends {} = {},
  TAuth extends {} = {},
  TRequest extends Request = Request,
  TFramework extends {} = {},
>(
  props: Props<TArgs, TServices, TAuth, TRequest, TFramework>,
) => {
  return createLogger({
    method: props.request.method,
    path: props.request.path,
  });
};

const makeSqsLogger = <
  TArgs extends {} = {},
  TServices extends {} = {},
  TAuth extends {} = {},
  TRequest extends Request = Request,
  TFramework extends {} = {},
>(
  props: Props<TArgs, TServices, TAuth, TRequest, TFramework>,
) => {
  return createLogger({});
};

export const makeLogger = <
  TArgs extends {} = {},
  TServices extends {} = {},
  TAuth extends {} = {},
  TRequest extends Request = Request,
  TFramework extends {} = {},
>(
  props: Props<TArgs, TServices, TAuth, TRequest, TFramework>,
) => {
  const framework = props.framework as unknown as LambdaFramework;
  if (framework.lambdaType === 'api') {
    return makeRequestLogger(props);
  } else if (framework.lambdaType === 'sqs') {
    return makeSqsLogger(props);
  }
  throw new Error('Failed to initialize logger due to unknown lambdaType');
};
