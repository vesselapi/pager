import { Response } from '@exobase/core';

type Json = string | number | boolean | { [x: string]: Json } | Array<Json>;

/**
 * API Response codes are all upper
 * snake case.
 */
export type ErrorCode =
  // 5xx family
  | 'ERROR'
  // 400 family
  | 'BAD_REQUEST'
  | 'INVALID_JSON_BODY'
  // 401 family
  | 'NOT_AUTHENTICATED'
  // 403 family
  | 'NOT_AUTHORIZED'
  // 404 family
  | 'NOT_FOUND';

export const isError = (err: any): err is ApiError => {
  return err instanceof ApiError;
};

export type ErrorProperties = {
  message: string;
  code?: ErrorCode;
} & Record<string, Json>;

export type ErrorPropertiesWithoutStatus = {
  message?: string;
  code?: ErrorCode;
  status?: never;
} & Record<string, Json>;

type ResponseOptions = Pick<Response, 'headers' | 'status'>;

/**
 * This error class is designed to be returned to the
 * user. When thrown, eventually a root hook will
 * handle it, convert it to json, and return it in a
 * response.
 */
export class ApiError extends Error {
  properties: ErrorProperties;
  options: ResponseOptions;
  dontAlert = true;
  constructor(
    /**
     * Any json serializable value is allowed in
     * the object, the entire object will be
     * serialized and returned to the user.
     */
    error: ErrorProperties,
    options: Partial<ResponseOptions> = {},
  ) {
    super(error.message);
    // Set the prototype explicitly so that instanceof
    // will work as expeted. Object.setPrototypeOf needs
    // to be called immediately after the super(...) call
    // https://stackoverflow.com/a/41429145/7547940
    Object.setPrototypeOf(this, ApiError.prototype);
    this.properties = error;
    this.options = {
      status: 500,
      headers: {},
      ...options,
    };
  }
}

//
// Just the few most commonly used
// errors for convenience.
//

export class BadRequestError extends ApiError {
  constructor(error: ErrorPropertiesWithoutStatus = {}) {
    super(
      {
        ...error,
        status: 400,
        code: 'BAD_REQUEST',
        message: error.message ?? 'Bad Request',
      },
      {
        status: 400,
      },
    );
  }
}

export class NotAuthenticatedError extends ApiError {
  constructor(error: ErrorPropertiesWithoutStatus = {}) {
    super(
      {
        ...error,
        status: 401,
        code: 'NOT_AUTHENTICATED',
        message: error.message ?? 'Not Authenticated',
      },
      {
        status: 401,
      },
    );
  }
}

export class NotAuthorizedError extends ApiError {
  constructor(error: ErrorPropertiesWithoutStatus = {}) {
    super(
      {
        ...error,
        status: 403,
        code: 'NOT_AUTHORIZED',
        message: error.message ?? 'Not Authorized',
      },
      {
        status: 403,
      },
    );
  }
}

export class NotFoundError extends ApiError {
  constructor(error: ErrorPropertiesWithoutStatus = {}) {
    super(
      {
        ...error,
        status: 404,
        code: 'NOT_FOUND',
        message: error.message ?? 'Not Found',
      },
      {
        status: 404,
      },
    );
  }
}

export class MethodNotAllowedError extends ApiError {
  constructor(error: ErrorPropertiesWithoutStatus = {}) {
    super(
      {
        ...error,
        status: 405,
        message: error.message ?? 'Method Not Allowed',
      },
      {
        status: 405,
      },
    );
  }
}

export class TooManyRequestsError extends ApiError {
  constructor(error: ErrorPropertiesWithoutStatus = {}) {
    super(
      {
        ...error,
        status: 429,
        message: error.message ?? 'Too Many Requests',
      },
      {
        status: 429,
      },
    );
  }
}
