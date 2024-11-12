import { getServerSession } from '@auth/core';
import { authConfig } from './auth.config';

export async function auth() {
  const session = await getServerSession(authConfig);
  return session;
}
