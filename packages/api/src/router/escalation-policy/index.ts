import { createTRPCRouter } from '../../trpc';
import { escalationPolicyCreate } from './create';
import { escalationPolicyList } from './list';

export const escalationPolicyRouter = createTRPCRouter({
  create: escalationPolicyCreate,
  list: escalationPolicyList,
});
