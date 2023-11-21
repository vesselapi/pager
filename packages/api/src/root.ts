import { alertRouter } from './router/alert';
import { userRouter } from './router/user';
import { createTRPCRouter } from './trpc';

export const appRouter = createTRPCRouter({
  alert: alertRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
