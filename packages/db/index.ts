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
  organization as organizationSchema,
  selectOrgSchema,
} from './schema/organization';
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
  organization: organizationSchema,
  user: userSchema,
  secret: secretSchema,
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
  organizations: {
    find: async (id: OrgId) => {
      const organization = await db.query.organization.findFirst({
        where: eq(organizationSchema.id, id as string),
      });
      if (!organization) return null;
      return selectOrgSchema.parse(organization);
    },
    list: async (
      ...args: Parameters<typeof db.query.organization.findMany>
    ) => {
      const organizations = await db.query.organization.findMany(...args);
      return organizations.map((a) => selectOrgSchema.parse(a));
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
});

export const db = createDbClient(drizzleDbClient);
export type Db = typeof db;
