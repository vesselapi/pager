import { redirect } from 'next/navigation';

/**
 * For now, we'll have the list alerts view be the 'home' page.
 */
export function GET(_request: Request) {
  redirect('/alerts');
}
