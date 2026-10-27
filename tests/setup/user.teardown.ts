import { expect, test as teardown } from '@playwright/test';
import { createApiContext } from '@api/api-context';
import { AuthClient } from '@api/auth-client';
import { env } from '@utils/env';
import { readTestUser, removeTestUserFile } from '@utils/test-user';

teardown('delete the dedicated test user', async ({ playwright }) => {
  const { id } = readTestUser();
  const api = await createApiContext(playwright);
  const auth = new AuthClient(api);

  const response = await auth.deleteUser(id, await auth.tokenFor(env.admin));
  // 409: the user has orders (invoices) and the API keeps it; nothing else to clean up.
  expect([204, 404, 409], `deleting test user ${id}`).toContain(response.status());
  teardown.info().annotations.push({
    type: 'cleanup',
    description: `DELETE /users/${id} -> ${response.status()}`,
  });

  await api.dispose();
  removeTestUserFile();
});
