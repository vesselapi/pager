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
  /**
   * Our theme is crucial to the UI of our application, changes here
   * can have far-reaching consequences and should be done with
   * intention.
   */
  theme: {
    extend: {
      height: {
        card: '130px',
        'card-lg': '200px',
        'card-xl': '300px',
      },
      colors: {
        'light-grey': '#fafafa',

        'red-500': '#F15D3D',
        'red-400': '#F37155',
        'red-300': '#F4856E',
        'red-200': '#F69A86',
        'red-100': '#F8AE9E',

        'green-500': '#45E93A',
        'green-400': '#5CEC53',
        'green-300': '#74EE6B',
        'green-200': '#8BF184',
        'green-100': '#A2F49D',

        'purple-400': '#C454F3',
        'purple-300': '#CD6DF4',
        'purple-200': '#D585F6',
        'purple-100': '#DE9DF8',
      },
      /**
       * @Guidelines - Lean smaller, more compact sizes.
       */
      fontSize: {
        xxxs: '4px',
        xxs: '8px',
        xs: '12px',
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
