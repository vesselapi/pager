import { redirect } from 'next/navigation';

/**
 * For now, we'll have the list alerts view be the 'home' page.
 */
export async function GET(request: Request) {
  redirect('/alerts');
}
