import { createTRPCRouter } from '../../trpc';
import { userMe } from './me';
import { userUpdate } from './update';
import { userUpdateExpoPushToken } from './update-expo-push-token';
import { userList } from './user-list';

export const userRouter = createTRPCRouter({
  list: userList,
  me: userMe,
  update: userUpdate,
  updateExpoPushToken: userUpdateExpoPushToken,
});
