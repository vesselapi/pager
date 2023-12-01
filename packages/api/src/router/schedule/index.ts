import { createTRPCRouter } from '../../trpc';
import { scheduleCreate } from './create';
import { scheduleList } from './list';

export const scheduleRouter = createTRPCRouter({
  create: scheduleCreate,
  list: scheduleList,
});
