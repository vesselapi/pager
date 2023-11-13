import { createTRPCRouter } from '../trpc';
import { alertById } from './alert/alert-by-id';
import { alertList } from './alert/alert-list';

export const alertRouter = createTRPCRouter({
  all: alertList,
  byId: alertById,
});
