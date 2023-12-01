import type { Config } from 'tailwindcss';

import baseConfig from '@vessel/tailwind-config';

export default {
  content: ['./src/**/*.{ts,tsx}'],
  presets: [baseConfig],
  safelist: [
    // Used by the Calendar component grid-cols 7-14
    ...Array.from({ length: 15 }, (_, i) => `grid-cols-${i + 1}`),
    ...Array.from({ length: 15 }, (_, i) => `col-span-${i + 1}`),
  ],
  theme: {
    // TODO(@zkirby): Add base styles here as named-variables
    // to ensure consistency.
    extend: {
      height: {
        card: '130px',
        'card-lg': '200px',
        'card-xl': '300px',
      },
      colors: {
        'light-grey': '#fafafa',
      },
      fontSize: {
        smr: '0.9em', // small-regular
      },
      gridTemplateColumns: {
        '13': 'repeat(13, minmax(0, 1fr))',
        '14': 'repeat(14, minmax(0, 1fr))',
      },
    },
  },
} satisfies Config;
