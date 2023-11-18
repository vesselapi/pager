import { z } from 'zod';

import type { Db, SQL } from '@vessel/db';
import { and, asc, db, desc, eq, ilike, not, or, schema } from '@vessel/db';
import { UserIdRegex } from '@vessel/types';

import { useLogger } from '../../middlewares/use-logger';
import { useServicesHook } from '../../middlewares/use-services-hook';
import { publicProcedure } from '../../trpc';

interface Context {
  db: Db;
}

// NOTE(@zkirby): Order matters, preceding sorts will sort first.
const sorts = z
  .array(
    z.object({
      property: z.enum(['status', 'title', 'assignedToId', 'createdAt']),
      order: z.enum(['asc', 'desc']).optional().default('asc'),
    }),
  )
  .optional();

const Conditions = {
  Is: 'IS' as const,
  IsNot: 'IS_NOT' as const,
  Contains: 'CONTAINS' as const,
};

// NOTE(@zkirby): All conditions are AND-ed, ORs can be done by supplying
// multiple values in the same filter (e.g., `value: ['ACKED', 'CLOSED']`).
// conditions should always take the shape:
// {
//    property: z.literal(),
//    value: z.any(),
//    conditions: z.enum(Conditions)
// }
const filters = z
  .array(
    z
      .object({
        property: z.literal('status'),
        value: z.array(z.enum(['ACKED', 'OPEN', 'CLOSED'])),
        condition: z.enum([Conditions.Is, Conditions.IsNot]),
      })
      .or(
        z.object({
          property: z.literal('title'),
          value: z.string(),
          // Supports the search functionality on the FE
          // for now until we implement more efficient search.
          condition: z.enum([Conditions.Contains]),
        }),
      )
      .or(
        z.object({
          property: z.literal('assignedToId'),
          value: z
            .string()
            .regex(UserIdRegex, `Invalid id, expected format ${UserIdRegex}`),
          // Only support "is assigned to" for now.
          condition: z.enum([Conditions.Is]),
        }),
      ),
    // TODO(@zkirby): Add filter support for createdAt times.
  )
  .optional();

const buildSortClause = (inputSorts: z.infer<typeof sorts>) => {
  if (!inputSorts?.length) return [];
  return inputSorts.map((s) => {
    const orderFn = s.order === 'asc' ? asc : desc;
    return orderFn(schema.alert[s.property]);
  });
};

const buildFilterClause = (inputFilters: z.infer<typeof filters>) => {
  if (!inputFilters?.length) return undefined;

  return inputFilters.reduce<SQL<unknown> | undefined>((curr, filter) => {
    const { property, value, condition } = filter;

    if ('status' === property) {
      const statusEquals = value.map((v) => eq(schema.alert.status, v));

      // expands to something like: not(or(eq(col, 'ACKED'), eq(col, 'CLOSED')))
      const conditions = or(...statusEquals)!;
      const shouldBeInverted = condition === Conditions.IsNot;
      const statusCondition = shouldBeInverted ? not(conditions) : conditions;

      return and(statusCondition, curr);
    } else if ('title' === property) {
      // WARNING(@zkirby): Not the most efficient way to implement this
      // filter but should be fine for now until we need to do something more efficient.
      const titleIsLike = ilike(schema.alert.title, `%${value}%`);
      return and(titleIsLike, curr);
    } else if ('assignedToId' === property) {
      const assignedToIdIs = eq(schema.alert.assignedToId, value);
      return and(assignedToIdIs, curr);
    }
  }, undefined);
};

const input = z.object({
  limit: z.number().optional(),
  offset: z.number().optional(),
  sorts,
  filters,
});

export const alertList = publicProcedure
  .use(
    useServicesHook<Context>({
      db: () => db,
    }),
  )
  .use(useLogger())
  .input(input)
  .query(({ ctx, input }) => {
    const sortClause = buildSortClause(input.sorts);
    const filterClause = buildFilterClause(input.filters);

    return ctx.db.alerts.list({
      limit: input.limit,
      offset: input.offset,
      orderBy: sortClause,
      where: filterClause,
    });
  });
