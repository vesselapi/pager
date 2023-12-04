import { createTRPCRouter } from '../../trpc';
import { scheduleUserList } from './list';

export const scheduleUserRouter = createTRPCRouter({
  list: scheduleUserList,
});
