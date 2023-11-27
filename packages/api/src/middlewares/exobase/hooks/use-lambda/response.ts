import type { Response } from '@exobase/core';
import { isNumber, isString } from 'radash';

import { isError } from '../../errors';

/**
 * There is a 1 in 1,000,000,000 chance that someone may
 * return an object with _type equal to '@response'
 * and this will break. Nobody do tha..
 */
export const isResponse = (res: any): res is Response => {
  return (res as Response)?.type === '@response';
};

export const defaultResponse: Response = {
  type: '@response',
  status: 200,
  headers: {},
  body: {},
  error: null,
};

export const responseFromResult = (result: any): Response => {
  if (isResponse(result)) return result;
  // If nothing was returned then return the default
  // success response
  if (!result) return defaultResponse;
  // Else, the function returned something that should be
  // returned as the json body response
  return {
    ...defaultResponse,
    body: result,
  };
};

export const responseFromError = (error: any): Response => {
  if (isResponse(error)) return error;
  // If the error is an ApiError then return it's
  // specified properties and status
  if (isError(error))
    return {
      ...defaultResponse,
      status: error.options.status,
      body: error.properties,
      error,
      headers: {
        ...defaultResponse.headers,
        ...error.options.headers,
      },
    };
  if (isNumber(error.statusCode) && isString(error.message)) {
    return {
      ...defaultResponse,
      status: error.statusCode,
      body: {
        errorCode: error.errorCode,
        message: error.message,
        ...(error.metadata ? { metadata: error.metadata } : {}),
      },
    };
  }
  // Else its an error we're not equipped to handle
  // return an unknown to the user.
  return {
    ...defaultResponse,
    status: 500,
    error,
    body: {
      message: 'Unknown Error',
    },
  };
};

export const response = (error: any, result: any) => {
  return error ? responseFromError(error) : responseFromResult(result);
};
