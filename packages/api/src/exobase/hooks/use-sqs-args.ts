import { BadRequestError, Handler, Props } from '@exobase/core';
import { isArray, isFunction, tryit } from 'radash';
import zod, { AnyZodObject, ZodArray, ZodError } from 'zod';

import { SqsLambdaFramework } from './use-lambda';

type Zod = typeof zod;
type KeyOfType<T, Value> = { [P in keyof T]: Value };

const isZodError = (e: any): e is ZodError =>
  e && e.issues && isArray(e.issues);

export const withSqsArgs = async (
  func: Handler,
  model: AnyZodObject | ZodArray<any>,
  mapper: (validatedData: any) => any,
  props: Props,
) => {
  const framework = props.framework as SqsLambdaFramework;
  const recordsArgs = [];
  for (const record of framework.event.Records) {
    const [zerr, args] = await tryit(model.parseAsync)(record);
    if (zerr) {
      if (!isZodError(zerr)) {
        throw new BadRequestError(
          'Json body validation failed: ' + zerr.message ?? 'Parse error',
          {
            key: 'err.json-body.parsing',
            cause: zerr,
          },
        );
      }
      throw new BadRequestError(
        'Json body validation failed: ' +
          zerr.issues
            .map((e) => `${e.path.join('.')}: ${e.message.toLowerCase()}`)
            .join(', '),
        {
          key: 'err.json-body.failed',
          cause: zerr,
        },
      );
    }
    recordsArgs.push(args);
  }

  for (const args of recordsArgs) {
    await func({
      ...props,
      args: {
        ...props.args,
        ...mapper(args),
      },
    });
  }
};

export const useSqsArgs: <TArgs extends {}, TProps extends Props = Props>(
  shapeMaker: AnyZodObject | ((z: Zod) => KeyOfType<TArgs, any>),
  mapper?: (validatedData: TArgs) => any,
) => (
  func: Handler<
    TProps & {
      args: TProps['args'] & TArgs;
    }
  >,
) => Handler<TProps> =
  (shapeMaker, mapper = (x) => x) =>
  (func) => {
    const model = isFunction(shapeMaker)
      ? zod.object(shapeMaker(zod))
      : shapeMaker;
    return (props) => withSqsArgs(func as Handler, model, mapper, props);
  };
