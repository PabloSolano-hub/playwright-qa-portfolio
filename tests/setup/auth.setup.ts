import fs from 'node:fs';
import { expect, test as setup } from '@playwright/test';
import { createApiContext } from '@api/api-context';
import { AuthClient } from '@api/auth-client';
import { RESET_WINDOW_TIMEOUT, retryOnServerError } from '@api/retry';
import type { User } from '@api/types';
import { buildUser } from '@data/user';
import { env } from '@utils/env';
import { AUTH_DIR, USER_STATE } from '@utils/paths';
import { saveTestUser } from '@utils/test-user';

// The Toolshop SPA keeps its JWT in localStorage under "auth-token".
const TOKEN_KEY = 'auth-token';

// Each run registers its own user instead of sharing the public demo customer:
// anyone on the internet can lock that account with three wrong passwords.
//
// The storage state is written directly instead of through a page, so the setup needs no
// browser: each CI job installs only the browser it tests.
setup('register and authenticate a dedicated test user', async ({ playwright }) => {
  setup.setTimeout(RESET_WINDOW_TIMEOUT + 30_000);
  const api = await createApiContext(playwright);
  const auth = new AuthClient(api);
  // A fresh user per attempt: a 5xx may still have created the previous one (409 on reuse).
  let user = buildUser();
  const registration = await retryOnServerError(() => {
    user = buildUser();
    return auth.register(user);
  }, 'registering the test user');
  await expect(registration, 'registering the test user').toBeOK();
  const { id } = (await registration.json()) as User;
  saveTestUser({ ...user, id });

  const token = await auth.tokenFor(user);
  await api.dispose();

  const storageState = {
    cookies: [],
    origins: [
      {
        origin: new URL(env.baseUrl).origin,
        localStorage: [{ name: TOKEN_KEY, value: token }],
      },
    ],
  };
  fs.mkdirSync(AUTH_DIR, { recursive: true });
  fs.writeFileSync(USER_STATE, JSON.stringify(storageState, null, 2));
});
