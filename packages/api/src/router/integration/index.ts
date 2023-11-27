import { createTRPCRouter } from '../../trpc';
import { integrationList } from './list';
import { integrationOAuthCallback } from './oauth-callback';
import { integrationOAuthStart } from './oauth-start';

export const integrationRouter = createTRPCRouter({
  list: integrationList,
  oauthStart: integrationOAuthStart,
  oauthCallback: integrationOAuthCallback,
});
