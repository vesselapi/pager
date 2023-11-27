import { procedure } from '../../trpc';
import { useLogger } from './use-logger';
import { useUserAuth } from './use-user-auth';

export const trpc = procedure.use(useLogger()).use(useUserAuth());
