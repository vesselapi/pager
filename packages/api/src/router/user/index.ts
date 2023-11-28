import { createTRPCRouter } from '../../trpc';
import { userMe } from './me';
import { userList } from './user-list';

export const userRouter = createTRPCRouter({
  all: userList,
  me: userMe,
});
