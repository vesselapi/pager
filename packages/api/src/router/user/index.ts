import { createTRPCRouter } from '../../trpc';
import { userList } from './list';
import { userMe } from './me';
import { userUpdate } from './update';
import { userUpdateExpoPushToken } from './update-expo-push-token';

export const userRouter = createTRPCRouter({
  list: userList,
  me: userMe,
  update: userUpdate,
  updateExpoPushToken: userUpdateExpoPushToken,
});
