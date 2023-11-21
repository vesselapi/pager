import type { Handler, Props, Request } from '@exobase/core';
import { props as initProps } from '@exobase/core';
import type { APIGatewayEvent, Context, SQSEvent } from 'aws-lambda';
import { isString, lowerize, partial, tryit } from 'radash';

import { responseFromError, responseFromResult } from './response';

export interface SqsLambdaFramework {
  context: Context;
  event: SQSEvent;
  lambdaType: 'sqs';
}

export interface ApiLambdaFramework {
  context: Context;
  event: APIGatewayEvent;
  lambdaType: 'api';
}

export type LambdaFramework = SqsLambdaFramework | ApiLambdaFramework;

interface LambdaOptions {
  throwOnError: boolean;
}

async function lambdaHandler(
  func: Handler<Props & { framework: LambdaFramework }>,
  options: LambdaOptions | undefined,
  event: APIGatewayEvent,
  context: Context,
) {
  const props: Props = initProps(makeRequest(event, context));
  const framework = props.request.method
    ? ({ event, context, lambdaType: 'api' } as ApiLambdaFramework)
    : ({
        event: event as unknown as SQSEvent,
        context,
        lambdaType: 'sqs',
      } as SqsLambdaFramework);

  const [error, result] = await tryit(func)({
    ...props,
    framework,
  });
  if (error) {
    console.error(error);

    if (options?.throwOnError) {
      throw error;
    }
  }

  const response = error
    ? responseFromError(error)
    : responseFromResult(result);

  // @link https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html
  return {
    body: response.body,
    isBase64Encoded: false,
    headers: {
      'content-type': 'application/json',
      ...response.headers,
    },
    statusCode: response.status,
  };
}

export const useLambda = (options?: LambdaOptions) => (func: Handler) => {
  return partial(lambdaHandler, func, options);
};

const makeRequest = (event: APIGatewayEvent, _context: Context): Request => {
  const headers = lowerize(event.headers ?? {}) as Record<
    string,
    string | string[]
  >;
  const req: Partial<typeof event.requestContext> = event.requestContext ?? {};

  const query = (event.queryStringParameters as Record<string, string>) ?? {};
  return {
    headers,
    url: event.path,
    path: event.path,
    body: (() => {
      if (!event.body || event.body === '') {
        return {};
      }
      if (event.isBase64Encoded) {
        return JSON.parse(Buffer.from(event.body, 'base64').toString());
      }
      if (isString(event.body)) {
        return JSON.parse(event.body);
      }
      return event.body;
    })(),
    method: req.httpMethod ?? event.httpMethod,
    query,
    ip: (req as any)?.http?.sourceIp ?? req.identity?.sourceIp,
    startedAt: Date.now(),
    protocol: req.protocol || '',
    httpVersion: req.protocol?.split('/')[1]! ?? '',
    params: event.pathParameters as Record<string, string>,
  };
};
