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
  TeamId,
  UserId,
} from '@vessel/types';

import { IdGenerator } from './id-generator';
import type { Alert, CreateAlert, UpsertAlert } from './schema/alert';
import {
  alert as alertSchema,
  alertSourceEnum,
  alertToEscalationPolicyRelation,
  insertAlertSchema,
  selectAlertSchema,
  statusEnum,
} from './schema/alert';
import type { CreateAlertEvent } from './schema/alert-event';
import {
  alertEvent as alertEventSchema,
  insertAlertEventSchema,
  selectAlertEventSchema,
} from './schema/alert-event';
import type { CreateEscalationPolicy } from './schema/escalation-policy';
import {
  escalationPolicy as escalationPolicySchema,
  escalationPolicyToAlertRelation,
  escalationPolicyToStepRelation,
  insertEscalationPolicySchema,
  selectEscalationPolicySchema,
} from './schema/escalation-policy';
import type { CreateEscalationPolicyStep } from './schema/escalation-policy-step';
import {
  escalationPolicyStep as escalationPolicyStepSchema,
  escalationPolicyStepType,
  insertEscalationPolicyStepSchema,
  selectEscalationPolicyStepSchema,
  stepToEscalationPolicyRelation,
} from './schema/escalation-policy-step';
import type { CreateIntegration } from './schema/integration';
import {
  appIdEnum,
  insertIntegrationSchema,
  integration as integrationSchema,
  selectIntegrationSchema,
} from './schema/integration';
import {
  insertOrgSchema,
  org as orgSchema,
  selectOrgSchema,
} from './schema/org';
import type { CreateSchedule, Schedule } from './schema/schedule';
import {
  insertScheduleSchema,
  schedule as scheduleSchema,
  scheduleToScheduleUserRelation,
  scheduleToTeamRelation,
  selectScheduleSchema,
} from './schema/schedule';
import type { CreateScheduleUser, ScheduleUser } from './schema/schedule-user';
import {
  insertScheduleUserSchema,
  scheduleUser as scheduleUserSchema,
  scheduleUserToScheduleRelation,
  scheduleUserToUserRelation,
  selectScheduleUserSchema,
} from './schema/schedule-user';
import type { insertSecretSchema } from './schema/secret';
import { secret as secretSchema, selectSecretSchema } from './schema/secret';
import type { CreateTeam, Team } from './schema/team';
import {
  insertTeamSchema,
  selectTeamSchema,
  teamScheduleRelation,
  team as teamSchema,
} from './schema/team';
import type { CreateUser, User } from './schema/user';
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
  alertToEscalationPolicyRelation,
  alertEvent: alertEventSchema,
  escalationPolicy: escalationPolicySchema,
  escalationPolicyStep: escalationPolicyStepSchema,
  escalationPolicyToAlertRelation,
  escalationPolicyToStepRelation,
  escalationPolicyStepType,
  stepToEscalationPolicyRelation,
  integration: integrationSchema,
  org: orgSchema,
  user: userSchema,
  secret: secretSchema,
  team: teamSchema,
  teamScheduleRelation,
  schedule: scheduleSchema,
  scheduleToScheduleUserRelation,
  scheduleToTeamRelation,
  scheduleUser: scheduleUserSchema,
  scheduleUserToUserRelation,
  scheduleUserToScheduleRelation,
};

export * from 'drizzle-orm';

const queryClient = postgres(process.env.DATABASE_URL!);

const drizzleDbClient = drizzle(queryClient, { schema });

// Type overrides ----------------------------
// These are needed because drizzle's typing doesn't work
// on nested relational queries for any depth greater than one,
// see: https://github.com/drizzle-team/drizzle-orm/issues/1256
type DbAlertWithEscalationPolicyAndSteps = Alert & {
  escalationPolicy: CreateEscalationPolicy & {
    steps: CreateEscalationPolicyStep[];
  };
};
type DbScheduleWithScheduleUsersAndUsers = Schedule & {
  scheduleUsers: (ScheduleUser & { user: User })[];
};
type DbScheduleWithScheduleUsersAndUsersAndTeam =
  DbScheduleWithScheduleUsersAndUsers & {
    team: Team;
  };
type DbTeamWithSchedulesAndScheduleUsersAndUsers = Team & {
  schedules: DbScheduleWithScheduleUsersAndUsers[];
};

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
    findWithEscalationPolicy: async (id: AlertId) => {
      const dbAlertNullable = await db.query.alert.findFirst({
        where: eq(alertSchema.id, id as string),
        with: {
          escalationPolicy: {
            with: {
              steps: true,
            },
          },
        },
      });
      if (!dbAlertNullable) return null;

      const dbAlert =
        dbAlertNullable as unknown as DbAlertWithEscalationPolicyAndSteps;

      const alert = selectAlertSchema.parse(dbAlert);
      if (!dbAlert.escalationPolicy) {
        throw new Error('Escalation policy not found');
      }
      const escalationPolicy = selectEscalationPolicySchema.parse(
        dbAlert.escalationPolicy,
      );
      if (dbAlert.escalationPolicy.steps.length === 0) {
        throw new Error('No steps found for escalation policy');
      }
      const escalationPolicySteps = dbAlert.escalationPolicy.steps.map((step) =>
        selectEscalationPolicyStepSchema.parse(step),
      );
      return { alert, escalationPolicy, escalationPolicySteps };
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
    create: async (alertEvent: CreateAlertEvent) => {
      const insertAlertEvent = insertAlertEventSchema.parse({
        id: IdGenerator.alertEvent,
        ...alertEvent,
      });
      const dbAlertEvents = await db
        .insert(alertEventSchema)
        .values(insertAlertEvent)
        .returning();
      return selectAlertEventSchema.parse(dbAlertEvents[0]);
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
    listByOrgId: async (orgId: OrgId) => {
      const dbEscalationPolicies = await db.query.escalationPolicy.findMany({
        where: eq(escalationPolicySchema.orgId, orgId),
      });
      return dbEscalationPolicies.map((policy) =>
        selectEscalationPolicySchema.parse(policy),
      );
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
      if (!integration) {
        return null;
      }
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
      const dbUser = await db.insert(userSchema).values(user).returning();
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
    newSignUp: async ({
      email,
      firstName,
      lastName,
      externalId,
    }: {
      email: string;
      firstName: string;
      lastName: string;
      externalId: string;
    }) => {
      const user = await db.transaction(async (tx) => {
        const insertOrg = insertOrgSchema.parse({
          id: IdGenerator.org(),
          name: 'My Organization',
        });
        const dbOrg = (
          await tx.insert(orgSchema).values(insertOrg).returning()
        )[0];
        const org = selectOrgSchema.parse(dbOrg);

        const insertUser = insertUserSchema.parse({
          id: IdGenerator.user(),
          email,
          firstName,
          lastName,
          orgId: org.id,
          externalId,
        });
        const user = await tx
          .insert(userSchema)
          .values(insertUser)
          .returning()[0];

        return selectUserSchema.parse(user);
      });
      return user;
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
  schedules: {
    create: async (schedule: CreateSchedule) => {
      const insertSchedule = insertScheduleSchema.parse({
        id: IdGenerator.schedule(),
        ...schedule,
      });
      const dbSchedule = await db
        .insert(scheduleSchema)
        .values(insertSchedule)
        .returning();
      return selectScheduleSchema.parse(dbSchedule[0]);
    },
    listByOrgId: async (orgId: OrgId) => {
      const dbSchedules = (await db.query.schedule.findMany({
        where: eq(scheduleSchema.orgId, orgId),
        with: {
          team: true,
          scheduleUsers: {
            with: {
              user: true,
            },
          },
        },
      })) as unknown as DbScheduleWithScheduleUsersAndUsersAndTeam[];

      return dbSchedules.map((schedule) => ({
        ...selectScheduleSchema.parse(schedule),
        team: selectTeamSchema.parse(schedule.team),
        users: schedule.scheduleUsers.map((scheduleUser) => ({
          ...selectUserSchema.parse(scheduleUser.user),
          ...selectScheduleUserSchema.parse(scheduleUser),
        })),
      }));
    },
  },
  scheduleUsers: {
    createMany: async (scheduleUsers: CreateScheduleUser[]) => {
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
        selectScheduleUserSchema.parse(scheduleUser),
      );
    },
    listByOrgId: async (orgId: OrgId) => {
      const scheduleUsers = await db.query.scheduleUser.findMany({
        where: eq(teamSchema.orgId, orgId),
      });
      return scheduleUsers.map((scheduleUser) =>
        selectScheduleUserSchema.parse(scheduleUser),
      );
    },
  },
  teams: {
    listByOrgId: async (orgId: OrgId) => {
      const teams = (await db.query.team.findMany({
        where: eq(teamSchema.orgId, orgId),
        // TODO(@zkirby): There's no way this is efficient at scale...
        with: {
          schedules: {
            with: {
              scheduleUsers: {
                with: {
                  user: true,
                },
              },
            },
          },
        },
      })) as unknown as DbTeamWithSchedulesAndScheduleUsersAndUsers[];

      return teams.map((team) => {
        return {
          ...selectTeamSchema.parse(team),
          schedules: team.schedules.map((schedule) => ({
            ...selectScheduleSchema.parse(schedule),
            scheduleUsers: schedule.scheduleUsers.map((scheduleUser) => ({
              ...selectScheduleUserSchema.parse(scheduleUser),
              user: selectUserSchema.parse(scheduleUser.user),
            })),
          })),
        };
      });
    },
    create: async (team: CreateTeam) => {
      const insertTeam = insertTeamSchema.parse({
        id: IdGenerator.team(),
        ...team,
      });
      const dbTeam = await db.insert(teamSchema).values(insertTeam).returning();
      return selectTeamSchema.parse(dbTeam[0]);
    },
    find: async (teamId: TeamId) => {
      const dbTeam = await db.query.team.findFirst({
        where: eq(teamSchema.id, teamId),
      });
      if (!dbTeam) return null;
      return selectTeamSchema.parse(dbTeam);
    },
  },
  // NOTE: This is primarily used for scripts only. Scripts will hang at the end
  // because the connection is still open. This will close the connection.
  _end: async () => {
    await queryClient.end();
  },
});

export const db = createDbClient(drizzleDbClient);
export type Db = typeof db;
