import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { z } from 'zod';

import type {
  AlertEventId,
  AlertId,
  OrgId,
  SecretId,
  UserId,
} from '@vessel/types';

import { IdGenerator } from './id-generator';
import {
  alert as alertSchema,
  CreateAlert,
  insertAlertSchema,
  selectAlertSchema,
} from './schema/alert';
import {
  alertEvent as alertEventSchema,
  selectAlertEventSchema,
} from './schema/alertEvent';
import {
  CreateIntegration,
  insertIntegrationSchema,
  integration as integrationSchema,
  selectIntegrationSchema,
} from './schema/integration';
import { org as orgSchema, selectOrgSchema } from './schema/org';
import {
  CreateSchedule,
  insertScheduleSchema,
  schedule as scheduleSchema,
  selectScheduleSchema,
} from './schema/schedule';
import {
  CreateScheduleUser,
  insertScheduleUserSchema,
  scheduleUser as scheduleUserSchema,
  selectScheduleUser,
} from './schema/schedule-user';
import {
  insertSecretSchema,
  secret as secretSchema,
  selectSecretSchema,
} from './schema/secret';
import {
  CreateUser,
  selectUserSchema,
  user as userSchema,
} from './schema/user';

export const schema = {
  alert: alertSchema,
  alertEvent: alertEventSchema,
  integration: integrationSchema,
  org: orgSchema,
  user: userSchema,
  secret: secretSchema,
  schedule: scheduleSchema,
  scheduleUser: scheduleUserSchema,
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
    create: async (alert: Omit<CreateAlert, 'id'>) => {
      const newAlert = insertAlertSchema.parse({
        id: IdGenerator.alert(),
        ...alert,
      });
      const dbAlert = await db.insert(alertSchema).values(newAlert).returning();
      return selectAlertSchema.parse(dbAlert);
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
  integrations: {
    listByOrgId: async (orgId: OrgId) => {
      const integrations = await db.query.integration.findMany({
        where: eq(integrationSchema.orgId, orgId),
      });
      return integrations.map((x) => selectIntegrationSchema.parse(x));
    },
    create: async (integration: Omit<CreateIntegration, 'id'>) => {
      const newIntegration = insertIntegrationSchema.parse({
        id: IdGenerator.integration({
          orgId: integration.orgId,
          appId: integration.appId,
        }),
        ...alert,
      });
      const dbAlert = await db
        .insert(integrationSchema)
        .values(newIntegration)
        .returning();
      return selectAlertSchema.parse(dbAlert);
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
      const org = await db.insert(orgSchema).values({
        id: IdGenerator.org(),
        name: 'My Organization',
      });
      return selectOrgSchema.parse(org);
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
    list: async (...args: Parameters<typeof db.query.user.findMany>) => {
      const users = await db.query.user.findMany(...args);
      return users.map((a) => selectUserSchema.parse(a));
    },
    create: async (user: Omit<CreateUser, 'id'>) => {
      const dbUser = await db.insert(userSchema).values({
        id: IdGenerator.user(),
        ...user,
      });
      return dbUser;
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
      await db.insert(secretSchema).values(secret);
    },
  },
  schedules: {
    listByOrgId: async (orgId: OrgId) => {
      const schedules = await db.query.schedule.findMany({
        where: eq(scheduleSchema.orgId, orgId),
      });
      return schedules.map((schedule) => selectScheduleSchema.parse(schedule));
    },
    create: async (schedule: Omit<CreateSchedule, 'id'>) => {
      const parsedSchedule = insertScheduleSchema.parse(schedule);
      const dbSchedule = await db
        .insert(scheduleSchema)
        .values(parsedSchedule)
        .returning();
      const newSchedule = dbSchedule[0];
      if (!newSchedule) {
        throw new Error('Failed to create schedule');
      }
      return selectScheduleSchema.parse(newSchedule);
    },
  },
  scheduleUsers: {
    createMany: async (scheduleUsers: Omit<CreateScheduleUser, 'id'>[]) => {
      const insertScheduleUsers = scheduleUsers.map((scheduleUser) => {
        const insertScheduleUser = {
          id: IdGenerator.scheduleUser(),
          ...scheduleUser,
        };
        return insertScheduleUserSchema.parse(insertScheduleUser);
      });
      const dbScheduleUsers = await db
        .insert(scheduleUserSchema)
        .values(insertScheduleUsers)
        .returning();
      return dbScheduleUsers.map((scheduleUser) =>
        selectScheduleUser.parse(scheduleUser),
      );
    },
  },
});

export const db = createDbClient(drizzleDbClient);
export type Db = typeof db;
