import { createTRPCRouter } from '../../trpc';
import { scheduleList } from './list';

export const scheduleRouter = createTRPCRouter({
  list: scheduleList,
});
