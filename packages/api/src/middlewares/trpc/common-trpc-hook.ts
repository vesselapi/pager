import { publicProcedure } from '../../trpc';
import { useLogger } from './use-logger';
import { useUserAuth } from './use-user-auth';

export const trpc = publicProcedure.use(useLogger()).use(useUserAuth());
