import { z } from 'zod';

import type { Db } from '@vessel/db';
import { db } from '@vessel/db';
import { insertEscalationPolicySchema } from '@vessel/db/schema/escalation-policy';
import { insertEscalationPolicyStepSchema } from '@vessel/db/schema/escalation-policy-step';

import { trpc } from '../../middlewares/trpc/common-trpc-hook';
import { useServicesHook } from '../../middlewares/trpc/use-services-hook';

interface Context {
  db: Db;
}
const input = z.object({
  escalationPolicy: insertEscalationPolicySchema.pick({
    name: true,
  }),
  escalationPolicySteps: z.array(
    insertEscalationPolicyStepSchema.sourceType().pick({
      type: true,
      order: true,
      scheduleId: true,
      rotationId: true,
      userId: true,
      nextStepInSeconds: true,
    }),
  ),
});

export const escalationPolicyCreate = trpc
  .use(
    useServicesHook<Context>({
      db: () => db,
    }),
  )
  .input(input)
  .mutation(async ({ ctx, input }) => {
    const { orgId } = ctx.auth.user;
    const escalationPolicy = await ctx.db.escalationPolicy.create({
      orgId,
      ...input.escalationPolicy,
    });
    const escalationPolicySteps = input.escalationPolicySteps.map((step) => ({
      orgId,
      escalationPolicyId: escalationPolicy.id,
      scheduleId: step.scheduleId ?? null,
      rotationId: step.rotationId ?? null,
      userId: step.userId ?? null,
      ...step,
    }));
    const dbEscalationPolicySteps =
      await ctx.db.escalationPolicyStep.createMany(escalationPolicySteps);
    return { escalationPolicy, escalationPolicySteps: dbEscalationPolicySteps };
  });
