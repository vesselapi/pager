import { input, z } from 'zod';

import type { Db } from '@vessel/db';
import { asc, db, desc, schema } from '@vessel/db';

import { useContextHook } from '../../middlewares/use-context-hook';
import { useLogger } from '../../middlewares/use-logger';
import { publicProcedure } from '../../trpc';

interface Context {
  db: Db;
}

const Conditions = {
  Is: 'IS',
  IsNot: 'IS_NOT',
  Contains: 'CONTAINS',
};


// NOTE(@zkirby): Order matters as preceding sorts will sort the list first.
const sorts = z
.array(
  z.object({
    property: z.enum(['status', 'title', 'assignedToId', 'createdAt']),
    order: z.enum(['asc', 'desc']).optional().default('asc'),
  }),
)
.optional()

// NOTE(@zkirby): All conditions are AND-ed, ORs can be done by supplying
// multiple values in the same filter (e.g., `value: ['ACKED', 'CLOSED']`)
const filters =  z.array(
  z.object({
  status: z.object({
    value: z.array(z.enum(['ACKED', 'OPEN', 'CLOSED'])),
    condition: z.enum([Conditions.Is, Conditions.IsNot]),
  }).or(z.object({
    title: z.object({
      value: z.string(),
      // Supports the search functionality on the FE
      // for now until we implement more efficient search.
      condition: z.enum([Conditions.Contains]),
    })
  })).or(
    z.object({
      assignedToId: z.object({
        value: z.string(),
        // Only support "is assigned to" for now.
        condition: z.enum([Conditions.Is]),
      })
    })
  ),
  // TODO(@zkirby): Add filter support for createdAt times.
})
.partial()
.optional()  
)

const input = z.object({
  limit: z.number().optional(),
  offset: z.number().optional(),
  sorts,
  filters,
});


const buildSortClause = (inputSorts: z.infer<typeof sorts>) => {
  if (!inputSorts?.length) return [];
  return inputSorts.map(s => {
    const orderFn = s.order === 'asc' ? asc : desc
    return orderFn(schema.alert[s.property]);
  })
}

// const buildFilterClause = (inputFilters: z.infer<typeof filters>) => {
//   if (!inputFilters) return null;

//   const filterClause = {}
//   // if (inputFilters?.status) {
//   //   filterClause = {
//   //     ...filterClause,
//   //     status: 
//   //   }
//   // }

//   return filterClause;
// };

export const alertList = publicProcedure
  .use(
    useContextHook<Context>({
      db: () => db,
    }),
  )
  .use(useLogger())
  .input(input)
  .query(({ ctx, input }) => {
    const sortClause = buildSortClause(input.sorts);
    // const filterClause = buildFilterClause(input.filters);

    return ctx.db.query.alert.findMany({
      limit: input.limit,
      offset: input.offset,
      orderBy: sortClause,
      // where: filterClause,
    });
  });
