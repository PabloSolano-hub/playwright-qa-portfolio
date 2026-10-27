import type { APIRequestContext, PlaywrightWorkerArgs } from '@playwright/test';
import { env } from '@utils/env';

/**
 * Without "Accept: application/json" the Laravel backend answers validation errors
 * with a 302 redirect to an HTML page instead of a 422 JSON body.
 */
export const API_HEADERS = { Accept: 'application/json' } as const;

export async function createApiContext(
  playwright: PlaywrightWorkerArgs['playwright'],
  token?: string,
): Promise<APIRequestContext> {
  return playwright.request.newContext({
    baseURL: `${env.apiUrl}/`,
    extraHTTPHeaders: token ? { ...API_HEADERS, Authorization: `Bearer ${token}` } : API_HEADERS,
  });
}
