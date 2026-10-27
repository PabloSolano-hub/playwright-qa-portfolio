import { expect, test } from '@fixtures/test';
import { readTestUser } from '@utils/test-user';

// The login form itself is under test, so start without the shared session.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login', () => {
  test(
    '@ESC-LOGIN-001 customer logs in with valid credentials',
    // Excluded from CI only: Cloudflare challenges the post-login page for GitHub runner IPs.
    // Runs locally on all three browsers; login stays covered on CI by the API auth tests.
    { tag: '@cloudflare-ci' },
    async ({ loginPage, accountPage, page }) => {
      const user = readTestUser();

      await loginPage.goto();
      await loginPage.login(user);

      await expect(page).toHaveURL(accountPage.url);
      await expect(accountPage.title).toHaveText('My account');
      await expect(accountPage.header.userMenu).toHaveText(`${user.first_name} ${user.last_name}`);
    },
  );
});
