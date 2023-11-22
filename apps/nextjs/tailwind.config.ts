import type { Config } from 'tailwindcss';

import baseConfig from '@vessel/tailwind-config';

export default {
  content: ['./src/**/*.{ts,tsx}'],
  presets: [baseConfig],
  theme: {
    extend: {
      colors: {
        'light-grey': '#fafafa',
      },
      fontSize: {
        smr: '0.9em', // small-regular
      },
    },
  },
} satisfies Config;
