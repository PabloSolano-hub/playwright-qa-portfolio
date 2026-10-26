import type { Response } from '@playwright/test';
import { env } from './env';

const apiOrigin = new URL(env.apiUrl).origin;

/**
 * Predicate for page.waitForResponse matching any API call on the given path.
 * The Toolshop SPA reads via the HTTP QUERY method (not GET), so we match any
 * method except the CORS preflight.
 */
export function isApiCall(pathname: string) {
  return (response: Response): boolean => {
    const url = new URL(response.url());
    return (
      url.origin === apiOrigin &&
      url.pathname === pathname &&
      response.request().method() !== 'OPTIONS'
    );
  };
}

/** Same as isApiCall, but only for successful responses. */
export function isApiResponse(pathname: string) {
  const matches = isApiCall(pathname);
  return (response: Response): boolean => matches(response) && response.ok();
}
