import { createTRPCRouter } from '../../trpc';
import { alertById } from './alert-by-id';
import { alertList } from './alert-list';

export const alertRouter = createTRPCRouter({
  all: alertList,
  byId: alertById,
});
