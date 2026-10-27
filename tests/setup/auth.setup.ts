import { expect, test as setup } from '@playwright/test';
import { createApiContext } from '@api/api-context';
import { AuthClient } from '@api/auth-client';
import type { User } from '@api/types';
import { buildUser } from '@data/user';
import { USER_STATE } from '@utils/paths';
import { saveTestUser } from '@utils/test-user';

// The Toolshop SPA keeps its JWT in localStorage under "auth-token".
// Logging in through the API is faster and less flaky than driving the login form.
const TOKEN_KEY = 'auth-token';

// Each run registers its own user instead of sharing the public demo customer:
// anyone on the internet can lock that account with three wrong passwords.
setup('register and authenticate a dedicated test user', async ({ page, playwright }) => {
  const api = await createApiContext(playwright);
  const auth = new AuthClient(api);
  const user = buildUser();
  const registration = await auth.register(user);
  await expect(registration, 'registering the test user').toBeOK();
  const { id } = (await registration.json()) as User;
  saveTestUser({ ...user, id });

  const token = await auth.tokenFor(user);
  await api.dispose();

  await page.addInitScript(
    ([key, value]) => {
      window.localStorage.setItem(key, value);
    },
    [TOKEN_KEY, token] as const,
  );
  await page.goto('/');
  expect(await page.evaluate((key) => window.localStorage.getItem(key), TOKEN_KEY)).toBe(token);
  await page.context().storageState({ path: USER_STATE });
});
