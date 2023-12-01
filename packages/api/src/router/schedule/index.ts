import { createTRPCRouter } from '../../trpc';
import { scheduleCreate } from './create';

export const scheduleRouter = createTRPCRouter({
  create: scheduleCreate,
});
