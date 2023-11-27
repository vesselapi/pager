import { createTRPCRouter } from '../../trpc';
import { userMe } from './me';

export const userRouter = createTRPCRouter({
  me: userMe,
});
