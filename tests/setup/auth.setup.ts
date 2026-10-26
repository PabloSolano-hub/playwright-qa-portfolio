import { expect, test as setup } from '@playwright/test';
import { createApiContext } from '@api/api-context';
import { AuthClient } from '@api/auth-client';
import { env } from '@utils/env';
import { CUSTOMER_STATE } from '@utils/paths';

// The Toolshop SPA keeps its JWT in localStorage under "auth-token".
// Logging in through the API is faster and less flaky than driving the login form.
const TOKEN_KEY = 'auth-token';

setup('authenticate as customer', async ({ page, playwright }) => {
  const api = await createApiContext(playwright);
  const token = await new AuthClient(api).tokenFor(env.customer);
  await api.dispose();

  await page.addInitScript(
    ([key, value]) => {
      window.localStorage.setItem(key, value);
    },
    [TOKEN_KEY, token] as const,
  );
  await page.goto('/');
  expect(await page.evaluate((key) => window.localStorage.getItem(key), TOKEN_KEY)).toBe(token);
  await page.context().storageState({ path: CUSTOMER_STATE });
});
