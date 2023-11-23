import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';

import '~/styles/globals.css';

import { headers } from 'next/headers';
import classNames from 'classnames';

import SideNav from './_components/SideNav';
import { TRPCReactProvider } from './providers';

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

/**
 * Since we're passing `headers()` to the `TRPCReactProvider` we need to
 * make the entire app dynamic. You can move the `TRPCReactProvider` further
 * down the tree (e.g. /dashboard and onwards) to make part of the app statically rendered.
 */
export const dynamic = 'force-dynamic';

// TODO: Fill this in when we're closer to GA
// export const metadata: Metadata = {
//   title: 'Create T3 Turbo',
//   description: 'Simple monorepo with shared backend for web & mobile apps',
//   openGraph: {
//     title: 'Create T3 Turbo',
//     description: 'Simple monorepo with shared backend for web & mobile apps',
//     url: 'https://create-t3-turbo.vercel.app',
//     siteName: 'Create T3 Turbo',
//   },
//   twitter: {
//     card: 'summary_large_image',
//     site: '@jullerino',
//     creator: '@jullerino',
//   },
// };
/**
 * TODO:
 * - Should show "please use desktop" for mobile view.
 */
export default function Layout(props: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={classNames(
            ['font-sans', fontSans.variable].join(' '),
            'overflow-y-hidden',
          )}
        >
          <TRPCReactProvider headers={headers()}>
            <SideNav>{props.children}</SideNav>
          </TRPCReactProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
