import type { Db } from '@vessel/db';
import { db } from '@vessel/db';

import { SecretExpoPushTokenId } from '@vessel/types';
import { z } from 'zod';
import { trpc } from '../../middlewares/trpc/common-trpc-hook';
import { useServicesHook } from '../../middlewares/trpc/use-services-hook';
import {
  SecretManager,
  makeSecretManager,
} from '../../services/secret-manager';

interface Context {
  db: Db;
  secretManager: SecretManager;
}

const input = z.object({
  expoPushToken: z.string(),
});

export const userUpdateExpoPushToken = trpc
  .use(
    useServicesHook<Context>({
      db: () => db,
      secretManager: makeSecretManager,
    }),
  )
  .input(input)
  .mutation(async ({ ctx, input }) => {
    const { secretManager, db } = ctx;
    const { user } = ctx.auth;

    const { id: expoPushTokenSecretId } =
      (await secretManager.expoPushToken.create({
        orgId: user.orgId,
        userId: user.id,
        expoPushToken: input.expoPushToken,
      })) as { id: SecretExpoPushTokenId };
    await db.user.update(user.id, { expoPushTokenSecretId });
    return { success: true };
  });
