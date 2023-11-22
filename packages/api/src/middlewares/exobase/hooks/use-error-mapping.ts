import { ExobaseError, Response } from '@exobase/core';
import { useCatch } from '@exobase/hooks';
import { isArray } from 'radash';
import type { AggregateError } from 'radash';
import { serializeError } from 'serialize-error';

/**
 * This hook catches errors and maps them to
 * response object that will be returned to
 * the client.
 */
export const useErrorMapping = () =>
  useCatch((props, response): Response => {
    const error = response.error;
    if (!error) return response;

    if (error instanceof ExobaseError) {
      const status = error.status ?? 500;

      if (status >= 500) {
        console.error(
          `ExobaseError with statusCode=${status}`,
          serializeError(error),
        );
      }

      return {
        ...response,
        status,
        error,
        body: {
          result: null,
          error: {
            message: error.message,
            ...error.metadata,
          },
        },
      };
    }

    console.error('Unhandled error', { error: serializeError(error) });

    if (isAggregateError(error)) {
      return {
        ...response,
        status: 500,
        error,
        body: {
          result: null,
          error: {
            message: error.message,
            errors: error.errors,
          },
        },
      };
    }

    return {
      ...response,
      status: 500,
      error,
      body: {
        result: null,
        error: {
          message: 'Unknown Error',
        },
      },
    };
  });

const isAggregateError = (error: any): error is AggregateError => {
  return error && error.errors && isArray(error.errors);
};
