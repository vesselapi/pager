import { alertRouter } from './router/alert';
import { integrationRouter } from './router/integration';
import { createTRPCRouter } from './trpc';

export const appRouter = createTRPCRouter({
  alert: alertRouter,
  integration: integrationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
