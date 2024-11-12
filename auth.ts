import { getServerSession } from 'next-auth';
import { cookies } from 'next/headers';

export async function auth() {
  const session = await getServerSession();
  return session;
}
