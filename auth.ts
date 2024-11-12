import { getServerSession as getServerSessionHelper } from 'next-auth/next';
import { authConfig } from './auth.config';

export async function auth() {
  const session = await getServerSessionHelper(authConfig);
  return session;
}
