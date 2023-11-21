import { createTRPCRouter } from '../../trpc';
import { userList } from './user-list';

export const userRouter = createTRPCRouter({
  all: userList,
});
