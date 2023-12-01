import { createTRPCRouter } from '../../trpc';
import { teamCreate } from './create';
import { teamFind } from './find';
import { teamList } from './list';

export const teamRouter = createTRPCRouter({
  list: teamList,
  create: teamCreate,
  find: teamFind,
});
