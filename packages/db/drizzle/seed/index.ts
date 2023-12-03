import type { UserId } from '@vessel/types';
import parse from 'minimist';
import { parallel } from 'radash';
import { db } from '../..';

const TEAM_NAME = 'FE Team';
const NUM_ALERTS = 25;
const SCHEDULE_LENGTH_IN_SECONDS = `${60 * 60 * 24 * 7}`;

const makeTeam = ({ orgId }) => {
  return db.teams.create({
    orgId,
    name: TEAM_NAME,
  });
};

const makeSchedules = async ({ orgId, teamId }) => {
  return parallel(
    2,
    [
      db.schedules.create({
        orgId,
        teamId,
        name: 'FE Primary Schedule',
        lengthInSeconds: SCHEDULE_LENGTH_IN_SECONDS,
        startTime: new Date(),
      }),
      db.schedules.create({
        orgId,
        teamId,
        name: 'FE Secondary Schedule',
        lengthInSeconds: SCHEDULE_LENGTH_IN_SECONDS,
        startTime: new Date(),
      }),
    ],
    (p) => p,
  );
};

const makeEscPolicy = async ({ orgId }) => {
  return db.escalationPolicy.create({
    orgId,
    name: 'FE Esc Policy',
  });
};

const makeAlerts = ({ orgId, userId, escalationPolicyId }) => {
  return parallel(NUM_ALERTS, Array.from({ length: NUM_ALERTS }), () => {
    return db.alerts.create({
      orgId,
      escalationPolicyId,
      escalationStepState: 0,
      title: 'FE Alert',
      status: 'OPEN',
      source: 'API',
      assignedToId: userId,
    });
  });
};

const makeScheduleUsers = ({}) => {};

const makeEscalationPolicySteps = ({}) => {};

const run = async ({ userId }: { userId: UserId }) => {
  const user = await db.user.find(userId);

  if (!user) {
    throw new Error(
      `User with ${userId} not found, make sure to create an account before running the seed scripts.`,
    );
  }

  // TODO: Create fake teammates.
  const team = await makeTeam({ orgId: user.orgId });
  const policy = await makeEscPolicy({ orgId: user.orgId });

  const schedules = await makeSchedules({ orgId: user.orgId, teamId: team.id });
  await makeAlerts({
    orgId: user.orgId,
    escalationPolicyId: policy.id,
    userId: user.id,
  });

  await makeScheduleUsers();
  await makeEscalationPolicySteps();
};

run(
  parse(process.argv.slice(2), {
    alias: {
      'user-id': 'userId',
    },
  }),
).catch(console.error);
