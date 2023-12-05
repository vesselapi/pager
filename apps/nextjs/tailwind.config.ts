import type { Config } from 'tailwindcss';

import baseConfig from '@vessel/tailwind-config';

export default {
  content: ['./src/**/*.{ts,tsx}'],
  presets: [baseConfig],
  safelist: [
    // Used by the Calendar component
    ...Array.from({ length: 15 }, (_, i) => `grid-cols-${i + 1}`),
    ...Array.from({ length: 15 }, (_, i) => `col-span-${i + 1}`),
  ],
  /**
   * Our theme is crucial to the UI of our application, changes here
   * can have far-reaching consequences and should be done with
   * intention.
   */
  theme: {
    extend: {
      height: {
        card: '130px',
        'card-lg': '215px',
        'card-xl': '300px',
      },
      colors: {
        'light-grey': '#fafafa',
      },
      /**
       * @Guidelines - Lean smaller, more compact sizes.
       * @NOTE - xxxs, xxs, and xs have been bumped by 1px each.
       */
      fontSize: {
        xxxs: '5px',
        xxs: '9px',
        xs: '13px',
        sm: '14px',
        base: '16px',
        lg: '18px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '30px',
        '4xl': '36px',
        '5xl': '48px',
        '6xl': '64px',
        '7xl': '72px',
      },
      gridTemplateColumns: {
        '13': 'repeat(13, minmax(0, 1fr))',
        '14': 'repeat(14, minmax(0, 1fr))',
      },
    },
  },
} satisfies Config;
