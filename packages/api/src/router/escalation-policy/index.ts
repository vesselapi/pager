import { createTRPCRouter } from '../../trpc';
import { escalationPolicyCreate } from './create';

export const escalationPolicyRouter = createTRPCRouter({
  create: escalationPolicyCreate,
});
