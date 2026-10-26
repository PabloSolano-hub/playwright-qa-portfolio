import { expect, test } from '@fixtures/test';
import { env } from '@utils/env';

// The login form itself is under test, so start without the shared session.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login', () => {
  test('@ESC-LOGIN-001 customer logs in with valid credentials', async ({
    loginPage,
    accountPage,
    page,
  }) => {
    await loginPage.goto();
    await loginPage.login(env.customer);

    await expect(page).toHaveURL(accountPage.url);
    await expect(accountPage.title).toHaveText('My account');
    await expect(accountPage.header.userMenu).toHaveText('Jane Doe');
  });
});
