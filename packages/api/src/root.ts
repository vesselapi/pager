import { alertRouter } from './router/alert';
import { escalationPolicyRouter } from './router/escalation-policy';
import { integrationRouter } from './router/integration';
import { scheduleRouter } from './router/schedule';
import { teamRouter } from './router/team';
import { userRouter } from './router/user';
import { createTRPCRouter } from './trpc';

export const appRouter = createTRPCRouter({
  alert: alertRouter,
  user: userRouter,
  integration: integrationRouter,
  schedule: scheduleRouter,
  team: teamRouter,
  escalationPolicy: escalationPolicyRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
