import { createTRPCRouter } from '../../trpc';
import { scheduleCreate } from './create';
import { scheduleList } from './list';

export const scheduleRouter = createTRPCRouter({
  list: scheduleList,
  create: scheduleCreate,
});
