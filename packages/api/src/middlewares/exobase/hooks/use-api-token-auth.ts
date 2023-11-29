import type { Props } from '@exobase/core';
import { hook } from '@exobase/core';
import { isArray } from 'radash';

import type { ApiToken, OrgId } from '@vessel/types';

import type { SecretManager } from '../../../services/secret-manager';
import * as errors from '../errors';

const API_TOKEN_HEADER_KEY = 'x-vessel-api-token';

export interface ApiTokenAuth {
  apiToken: ApiToken;
  orgId: OrgId;
}

interface Services {
  secretManager: SecretManager;
}

export const useApiTokenAuth = () =>
  hook<Props<{}, Services>, Props<{}, {}, ApiTokenAuth>>(
    function useApiTokenAuth(func) {
      return async (props) => {
        const { secretManager } = props.services;

        const apiToken = props.request.headers[
          API_TOKEN_HEADER_KEY
        ] as ApiToken;
        if (isArray(apiToken)) {
          throw new errors.NotAuthenticatedError({
            message: `Invalid API token value, found multiple headers for "${API_TOKEN_HEADER_KEY}"`,
          });
        }

        if (!apiToken) {
          throw new errors.NotAuthenticatedError({
            message: `Missing API token in header key "${API_TOKEN_HEADER_KEY}"`,
          });
        }

        const apiTokenSecret = await secretManager.apiToken.find(apiToken);
        if (!apiTokenSecret) {
          throw new errors.NotAuthenticatedError({
            message: 'Invalid API token',
          });
        }

        if (apiTokenSecret.apiToken !== apiToken) {
          throw new errors.NotAuthenticatedError({
            message: 'Invalid API token',
          });
        }

        const auth: ApiTokenAuth = {
          apiToken: apiToken,
          orgId: apiTokenSecret.orgId!,
        };

        return await func({
          ...props,
          auth: {
            ...props.auth,
            ...auth,
          },
        });
      };
    },
  );
