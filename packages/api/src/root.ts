import { alertRouter } from './router/alert';
import { createTRPCRouter } from './trpc';

export const appRouter = createTRPCRouter({
  alert: alertRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
