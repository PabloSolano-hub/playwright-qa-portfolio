import { expect, test as teardown, type PlaywrightWorkerArgs } from '@playwright/test';
import { createApiContext } from '@api/api-context';
import { AuthClient } from '@api/auth-client';
import { env } from '@utils/env';
import { readTestUser, removeTestUserFile, testUserExists } from '@utils/test-user';

// 409: the user has orders (invoices) and the API keeps it; nothing else to clean up.
const ACCEPTED_STATUSES = [204, 404, 409];

/** Returns the DELETE status, or null when the setup never registered a user. */
async function deleteTestUser(
  playwright: PlaywrightWorkerArgs['playwright'],
): Promise<number | null> {
  // If the setup failed before registering the user, its own failure is the one to report.
  if (!testUserExists()) {
    return null;
  }
  const { id } = readTestUser();
  const api = await createApiContext(playwright);
  const auth = new AuthClient(api);
  const response = await auth.deleteUser(id, await auth.tokenFor(env.admin));
  await api.dispose();

  removeTestUserFile();
  return response.status();
}

teardown('delete the dedicated test user', async ({ playwright }) => {
  const status = await deleteTestUser(playwright);
  teardown.info().annotations.push({
    type: 'cleanup',
    description: `DELETE test user -> ${status ?? 'skipped, no user registered'}`,
  });
  expect([null, ...ACCEPTED_STATUSES]).toContain(status);
});
