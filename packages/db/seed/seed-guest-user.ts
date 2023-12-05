import { faker } from '@faker-js/faker';

import { db } from '..';
import { IdGenerator } from '../id-generator';
import { seedAlertsForUser } from './seed-existing-user';

const GUEST_USER_EMAIL = 'avery+guest@vessel.dev';

/**
 * This populates a guest user
 */
const run = async () => {
  const org = await db.orgs.create();

  const user = await db.user.create({
    id: IdGenerator.user(),
    orgId: org.id,
    email: GUEST_USER_EMAIL,
    firstName: `${faker.person.firstName()} (Test User)`,
    lastName: faker.person.lastName(),
    externalId: '',
  });

  await seedAlertsForUser({ userId: user.id, numAlerts: 25 });
  console.log('Done seeding guest user');
};

run().catch(console.error);
