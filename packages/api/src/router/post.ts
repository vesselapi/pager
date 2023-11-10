import { createTRPCRouter } from '../trpc';
import { postById } from './post-by-id';
import { postCreate } from './post-create';
import { postDelete } from './post-delete';
import { postList } from './post-list';

export const postRouter = createTRPCRouter({
  all: postList,
  byId: postById,
  create: postCreate,
  delete: postDelete,
});
