import { createTRPCRouter } from '../../trpc';
import { alertById } from './alert-by-id';
import { alertList } from './alert-list';
import { alertUpdate } from './alert-update';

export const alertRouter = createTRPCRouter({
  all: alertList,
  byId: alertById,
  update: alertUpdate,
});
