import { redirect } from 'next/navigation';

/**
 * Support Page Redirect
 * 
 * Redirects /support to /dashboard/support
 */
export default function SupportRedirect() {
  redirect('/dashboard/support');
}

