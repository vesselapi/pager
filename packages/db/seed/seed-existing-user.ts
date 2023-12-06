import { faker } from '@faker-js/faker';
import type { EscalationPolicyId, OrgId, TeamId, UserId } from '@vessel/types';
import parse from 'minimist';
import { list, parallel, shuffle } from 'radash';
import { db } from '..';
import { IdGenerator } from '../id-generator';
import type { CreateEscalationPolicyStep } from '../schema/escalation-policy-step';
import type { CreateScheduleUser } from '../schema/schedule-user';

interface SeedArgs {
  /**
   * The user to assign the alerts to. This must
   * be a pre-created test user. Create an account to
   * generate a user id.
   */
  userId: UserId;
  /**
   * The number of alerts to seed the
   * database with.
   */
  numAlerts: number;
}

const makeTeam = ({ orgId }: { orgId: OrgId }) => {
  return db.teams.create({
    orgId,
    name: 'FE Team',
  });
};
const makeTeammate = ({ orgId }: { orgId: OrgId }) => {
  return db.user.create({
    id: IdGenerator.user(),
    orgId,
    email: faker.internet.email(),
    firstName: `${faker.person.firstName()} (Test User)`,
    lastName: faker.person.lastName(),
    externalId: 'test-user',
  });
};
const makeSchedules = async ({
  orgId,
  teamId,
  name,
}: {
  orgId: OrgId;
  teamId: TeamId;
  name: string;
}) => {
  return db.schedules.create({
    orgId,
    teamId,
    name,
    lengthInSeconds: 60 * 60 * 24 * 7, // 1 week
    startTime: new Date(),
  });
};
const makeEscPolicy = async ({ orgId }: { orgId: OrgId }) => {
  return db.escalationPolicy.create({
    orgId,
    name: 'FE Esc Policy',
  });
};
const makeAlerts = ({
  orgId,
  userId,
  policyId,
}: {
  orgId: OrgId;
  userId: UserId;
  policyId: EscalationPolicyId;
}) => {
  return db.alerts.create({
    orgId,
    title: faker.hacker.phrase(),
    status: 'OPEN',
    assignedToId: userId,
    escalationPolicyId: policyId,
    escalationStepState: 0,
    source: 'API',
  });
};
const makeScheduleUsers = (user: CreateScheduleUser[]) => {
  return db.scheduleUsers.createMany(user);
};
const makeEscalationPolicySteps = (steps: CreateEscalationPolicyStep[]) => {
  return db.escalationPolicyStep.createMany(steps);
};

/**
 * This populates a given user (and subsequently their org) with
 * the following fake data:
 * - 2 Schedules, a primary and secondary
 * - 4 Teammates to assign to each schedule
 * - 1 Policy with three steps: primary schedule -> secondary schedule -> user
 * - N Alerts assigned to the user.
 */
export const seedAlertsForUser = async ({
  userId,
  numAlerts = 25,
}: SeedArgs) => {
  const user = await db.user.find(userId);

  if (!user) {
    throw new Error(
      `User with ${userId} not found, make sure to create an account before running the seed scripts.`,
    );
  }
  console.log(`Seeding ${user.email} with ${numAlerts} alerts.`);

  // Make Team
  console.log(`Creating team...`);
  const team = await makeTeam({ orgId: user.orgId });

  console.log(`Creating teammates...`);
  const teammates = await parallel(4, list(4), () =>
    makeTeammate({ orgId: user.orgId }),
  );
  const fullTeam = [user, ...teammates];
  console.log(
    `Created ${fullTeam.length} teammates: ${teammates
      .map((t) => t.email)
      .join(', ')}.`,
  );

  // Make Schedules
  console.log(`Creating schedules...`);
  const primarySchedule = await makeSchedules({
    orgId: user.orgId,
    teamId: team.id,
    name: 'Primary Schedule',
  });
  const secondarySchedule = await makeSchedules({
    orgId: user.orgId,
    teamId: team.id,
    name: 'Secondary Schedule',
  });
  console.log(`Created Schedule users...`);
  await makeScheduleUsers([
    // primary
    ...shuffle(fullTeam).map((teammate, index) => ({
      orgId: user.orgId,
      order: index,
      scheduleId: primarySchedule.id,
      userId: teammate.id,
    })),
    // secondary
    ...shuffle(fullTeam).map((teammate, index) => ({
      orgId: user.orgId,
      order: index,
      scheduleId: secondarySchedule.id,
      userId: teammate.id,
    })),
  ]);

  // Make Policy
  console.log(`Creating escalation policy...`);
  const policy = await makeEscPolicy({ orgId: user.orgId });
  console.log(`Creating escalation policy steps...`);
  await makeEscalationPolicySteps([
    {
      escalationPolicyId: policy.id,
      orgId: user.orgId,
      nextStepInSeconds: 60 * 5,
      type: 'SCHEDULE',
      order: 0,
      scheduleId: primarySchedule.id,
      userId: null,
    },
    {
      escalationPolicyId: policy.id,
      orgId: user.orgId,
      nextStepInSeconds: 60 * 5,
      type: 'SCHEDULE',
      order: 1,
      scheduleId: secondarySchedule.id,
      userId: null,
    },
    {
      escalationPolicyId: policy.id,
      type: 'USER',
      orgId: user.orgId,
      nextStepInSeconds: 0,
      order: 2,
      scheduleId: null,
      userId: user.id,
    },
  ]);

  // Make alerts
  console.log(`Creating alerts...`);
  await parallel(numAlerts, list(numAlerts), () =>
    makeAlerts({
      orgId: user.orgId,
      userId: user.id,
      policyId: policy.id,
    }),
  );

  console.log('Done!');
  await db._end();
};

seedAlertsForUser(
  parse(process.argv.slice(2), {
    alias: {
      'user-id': 'userId',
      'num-alerts': 'numAlerts',
    },
  }) as unknown as SeedArgs,
).catch(console.error);
