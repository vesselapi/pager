import { SSTConfig } from 'sst';

import { CoreStack } from './src/stacks/CoreStack';

export default {
  config(_input) {
    return {
      name: 'vessel',
      region: 'us-west-2',
    };
  },
  stacks(app) {
    app.stack(CoreStack);
  },
} satisfies SSTConfig;
