import { expect, type APIResponse } from '@playwright/test';

/**
 * The public demo resets its database at the top of every hour; for about a minute the API
 * answers 5xx and every id changes. Setup calls that create data go through this helper so a
 * run that starts inside that window waits it out instead of failing. 4xx responses are
 * returned as-is: they are real answers, not the reset.
 */
export const RESET_WINDOW_TIMEOUT = 90_000;

export async function retryOnServerError(
  send: () => Promise<APIResponse>,
  description: string,
): Promise<APIResponse> {
  let response: APIResponse | undefined;
  await expect(async () => {
    response = await send();
    expect(response.status(), `${description}: server error, retrying`).toBeLessThan(500);
  }).toPass({ intervals: [2_000, 5_000, 10_000, 20_000], timeout: RESET_WINDOW_TIMEOUT });
  // toPass only resolves after the callback has assigned a response.
  return response as APIResponse;
}
