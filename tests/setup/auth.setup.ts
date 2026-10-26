import { expect, request, test as setup } from '@playwright/test';
import { AuthClient } from '@api/auth-client';
import { env } from '@utils/env';
import { CUSTOMER_STATE } from '@utils/paths';

// The Toolshop SPA keeps its JWT in localStorage under "auth-token".
// Logging in through the API is faster and less flaky than driving the login form.
const TOKEN_KEY = 'auth-token';

setup('authenticate as customer', async ({ page }) => {
  const api = await request.newContext({ baseURL: `${env.apiUrl}/` });
  const { access_token } = await new AuthClient(api).login(env.customer);
  await api.dispose();

  await page.addInitScript(
    ([key, token]) => {
      window.localStorage.setItem(key, token);
    },
    [TOKEN_KEY, access_token] as const,
  );
  await page.goto('/');
  expect(await page.evaluate((key) => window.localStorage.getItem(key), TOKEN_KEY)).toBe(
    access_token,
  );
  await page.context().storageState({ path: CUSTOMER_STATE });
});
