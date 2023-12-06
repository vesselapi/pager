import { createTRPCRouter } from '../../trpc';
import { alertById } from './find';
import { alertList } from './list';
import { alertUpdate } from './update';

export const alertRouter = createTRPCRouter({
  all: alertList,
  byId: alertById,
  update: alertUpdate,
});
