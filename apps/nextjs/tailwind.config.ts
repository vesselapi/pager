import type { Config } from 'tailwindcss';

import baseConfig from '@vessel/tailwind-config';

export default {
  content: ['./src/**/*.{ts,tsx}'],
  presets: [baseConfig],
} satisfies Config;
