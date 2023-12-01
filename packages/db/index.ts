import { and, eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import type { z } from 'zod';

import type {
  AlertEventId,
  AlertId,
  AppId,
  OrgId,
  SecretId,
  UserId,
} from '@vessel/types';

import { IdGenerator } from './id-generator';
import type { CreateAlert, UpsertAlert } from './schema/alert';
import {
  alert as alertSchema,
  alertSourceEnum,
  insertAlertSchema,
  selectAlertSchema,
  statusEnum,
} from './schema/alert';
import {
  alertEvent as alertEventSchema,
  selectAlertEventSchema,
} from './schema/alertEvent';
import {
  CreateEscalationPolicy,
  escalationPolicy as escalationPolicySchema,
  insertEscalationPolicySchema,
  selectEscalationPolicySchema,
} from './schema/escalation-policy';
import {
  CreateEscalationPolicyStep,
  escalationPolicyStep as escalationPolicyStepSchema,
  escalationPolicyStepTypeEnum,
  insertEscalationPolicyStepSchema,
  selectEscalationPolicyStepSchema,
} from './schema/escalation-policy-step';
import type { CreateIntegration } from './schema/integration';
import {
  appIdEnum,
  insertIntegrationSchema,
  integration as integrationSchema,
  selectIntegrationSchema,
} from './schema/integration';
import { org as orgSchema, selectOrgSchema } from './schema/org';
import type { CreateSchedule } from './schema/schedule';
import {
  insertScheduleSchema,
  schedule as rotationSchema,
  selectScheduleSchema,
} from './schema/schedule';
import type { CreateScheduleUser } from './schema/schedule-user';
import {
  insertScheduleUserSchema,
  scheduleUser as rotationUserSchema,
  selectScheduleUserSchema,
} from './schema/schedule-user';
import {
  insertSecretSchema,
  secret as secretSchema,
  selectSecretSchema,
} from './schema/secret';
import type { CreateTeam } from './schema/team';
import {
  insertTeamSchema,
  team as scheduleSchema,
  selectTeamSchema,
} from './schema/team';
import type { CreateUser } from './schema/user';
import {
  insertUserSchema,
  selectUserSchema,
  user as userSchema,
} from './schema/user';

export const schema = {
  alertSourceEnum,
  appIdEnum,
  statusEnum,
  alert: alertSchema,
  alertEvent: alertEventSchema,
  escalationPolicy: escalationPolicySchema,
  escalationPolicyStep: escalationPolicyStepSchema,
  escalationPolicyStepTypeEnum,
  integration: integrationSchema,
  org: orgSchema,
  user: userSchema,
  secret: secretSchema,
  schedule: scheduleSchema,
  rotation: rotationSchema,
  rotationUser: rotationUserSchema,
};

export * from 'drizzle-orm';

const queryClient = postgres(process.env.DATABASE_URL!);

const drizzleDbClient = drizzle(queryClient, { schema });

const createDbClient = (db: typeof drizzleDbClient) => ({
  alerts: {
    find: async (id: AlertId) => {
      const alert = await db.query.alert.findFirst({
        where: eq(alertSchema.id, id as string),
      });
      if (!alert) return null;
      return selectAlertSchema.parse(alert);
    },
    list: async (...args: Parameters<typeof db.query.alert.findMany>) => {
      const alerts = await db.query.alert.findMany(...args);
      return alerts.map((a) => selectAlertSchema.parse(a));
    },
    update: async (id: AlertId, alert: UpsertAlert) => {
      return db
        .update(alertSchema)
        .set(insertAlertSchema.partial().parse({ id, ...alert }))
        .where(eq(alertSchema.id, id as string))
        .returning();
    },
    create: async (alert: CreateAlert) => {
      const newAlert = insertAlertSchema.parse({
        id: IdGenerator.alert(),
        ...alert,
      });
      const dbAlerts = await db
        .insert(alertSchema)
        .values(newAlert)
        .returning();
      return selectAlertSchema.parse(dbAlerts[0]);
    },
  },
  alertEvent: {
    find: async (id: AlertEventId) => {
      const alertEvent = await db.query.alertEvent.findFirst({
        where: eq(alertEventSchema.id, id as string),
      });
      if (!alertEvent) return null;
      return selectAlertEventSchema.parse(alertEvent);
    },
    list: async (...args: Parameters<typeof db.query.alertEvent.findMany>) => {
      const alertEvents = await db.query.alertEvent.findMany(...args);
      return alertEvents.map((a) => selectAlertEventSchema.parse(a));
    },
  },
  escalationPolicy: {
    create: async (escalationPolicy: CreateEscalationPolicy) => {
      const insertEscalationPolicy = insertEscalationPolicySchema.parse({
        id: IdGenerator.escalationPolicy(),
        ...escalationPolicy,
      });
      const dbEscalationPolicy = await db
        .insert(escalationPolicySchema)
        .values(insertEscalationPolicy)
        .returning();
      return selectEscalationPolicySchema.parse(dbEscalationPolicy[0]);
    },
  },
  escalationPolicyStep: {
    createMany: async (escalationPolicySteps: CreateEscalationPolicyStep[]) => {
      const insertEscalationPolicySteps = escalationPolicySteps.map((step) =>
        insertEscalationPolicyStepSchema.parse({
          id: IdGenerator.escalationPolicyStep(),
          ...step,
        }),
      );
      const dbEscalationPolicyStep = await db
        .insert(escalationPolicyStepSchema)
        .values(insertEscalationPolicySteps)
        .returning();
      return dbEscalationPolicyStep.map((step) =>
        selectEscalationPolicyStepSchema.parse(step),
      );
    },
  },
  integrations: {
    listByOrgId: async (orgId: OrgId) => {
      const integrations = await db.query.integration.findMany({
        where: eq(integrationSchema.orgId, orgId),
      });
      return integrations.map((x) => selectIntegrationSchema.parse(x));
    },
    create: async (integration: CreateIntegration) => {
      const newIntegration = insertIntegrationSchema.parse({
        id: IdGenerator.integration(),
        ...integration,
      });
      const dbIntegration = await db
        .insert(integrationSchema)
        .values(newIntegration)
        .returning();
      return selectIntegrationSchema.parse(dbIntegration[0]);
    },
    findByExternalId: async ({
      appId,
      externalId,
    }: {
      appId: AppId;
      externalId: string;
    }) => {
      const integration = await db.query.integration.findFirst({
        where: and(
          eq(integrationSchema.appId, appId),
          eq(integrationSchema.externalId, externalId),
        ),
      });
      return selectIntegrationSchema.parse(integration);
    },
  },
  orgs: {
    find: async (id: OrgId) => {
      const org = await db.query.org.findFirst({
        where: eq(orgSchema.id, id as string),
      });
      if (!org) return null;
      return selectOrgSchema.parse(org);
    },
    list: async (...args: Parameters<typeof db.query.org.findMany>) => {
      const orgs = await db.query.org.findMany(...args);
      return orgs.map((a) => selectOrgSchema.parse(a));
    },
    create: async () => {
      const org = await db
        .insert(orgSchema)
        .values({
          id: IdGenerator.org(),
          name: 'My Organization',
        })
        .returning();
      if (org.length !== 1)
        throw new Error(
          `Expected exactly one org to be created, got ${org.length}`,
        );
      return selectOrgSchema.parse(org[0]);
    },
  },
  user: {
    find: async (id: UserId) => {
      const user = await db.query.user.findFirst({
        where: eq(userSchema.id, id as string),
      });
      if (!user) return null;
      return selectUserSchema.parse(user);
    },
    findByEmail: async (email: string) => {
      const user = await db.query.user.findFirst({
        where: eq(userSchema.email, email),
      });
      if (!user) return null;
      return selectUserSchema.parse(user);
    },
    listByOrgId: async (orgId: OrgId) => {
      const users = await db.query.user.findMany({
        where: eq(userSchema.orgId, orgId as string),
      });
      return users.map((a) => selectUserSchema.parse(a));
    },
    create: async (user: CreateUser) => {
      const dbUser = await db
        .insert(userSchema)
        .values({
          id: IdGenerator.user(),
          ...user,
        })
        .returning();
      if (dbUser.length !== 1)
        throw new Error(
          `Expected exactly one user to be created, got ${dbUser.length}`,
        );
      return selectUserSchema.parse(dbUser[0]);
    },
    update: async (id: UserId, user: Partial<CreateUser>) => {
      const dbUser = await db
        .update(userSchema)
        .set(insertUserSchema.parse(user))
        .where(eq(userSchema.id, id))
        .returning();
      return selectUserSchema.parse(dbUser[0]);
    },
  },
  secret: {
    find: async (id: SecretId) => {
      const secret = await db.query.secret.findFirst({
        where: eq(secretSchema.id, id as string),
      });
      if (!secret) return null;
      return selectSecretSchema.parse(secret);
    },
    create: async (secret: z.infer<typeof insertSecretSchema>) => {
      const dbSecret = await db.insert(secretSchema).values(secret).returning();
      return selectSecretSchema.parse(dbSecret[0]);
    },
  },
  rotations: {
    createMany: async (rotations: CreateSchedule[]) => {
      const insertRotations = rotations.map((rotation) => {
        const insertRotation = {
          id: IdGenerator.schedule(),
          ...rotation,
        };
        return insertScheduleSchema.parse(insertRotation);
      });
      const dbRotations = await db
        .insert(rotationSchema)
        .values(insertRotations)
        .returning();
      return dbRotations.map((rotation) =>
        selectScheduleSchema.parse(rotation),
      );
    },
  },
  rotationUsers: {
    createMany: async (rotationUsers: CreateScheduleUser[]) => {
      const insertRotationUsers = rotationUsers.map((rotationUser) => {
        const insertRotationUser = {
          id: IdGenerator.scheduleUser(),
          ...rotationUser,
        };
        return insertScheduleUserSchema.parse(insertRotationUser);
      });
      const dbRotationUsers = await db
        .insert(rotationUserSchema)
        .values(insertRotationUsers)
        .returning();
      return dbRotationUsers.map((rotationUser) =>
        selectScheduleUserSchema.parse(rotationUser),
      );
    },
  },
  schedules: {
    listByOrgId: async (orgId: OrgId) => {
      const schedules = await db.query.schedule.findMany({
        where: eq(scheduleSchema.orgId, orgId),
      });
      return schedules.map((schedule) => selectTeamSchema.parse(schedule));
    },
    create: async (schedule: CreateTeam) => {
      const parsedSchedule = insertTeamSchema.parse(schedule);
      const dbSchedule = await db
        .insert(scheduleSchema)
        .values(parsedSchedule)
        .returning();
      const newSchedule = dbSchedule[0];
      if (!newSchedule) {
        throw new Error('Failed to create schedule');
      }
      return selectTeamSchema.parse(newSchedule);
    },
  },
});

export const db = createDbClient(drizzleDbClient);
export type Db = typeof db;
