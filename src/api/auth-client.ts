import { expect, type APIRequestContext, type APIResponse } from '@playwright/test';
import type { Credentials } from '@utils/env';
import type { LoginResponse, NewUser } from './types';

export class AuthClient {
  constructor(private readonly request: APIRequestContext) {}

  login({ email, password }: Credentials): Promise<APIResponse> {
    return this.request.post('users/login', { data: { email, password } });
  }

  /** Logs in and returns the access token, failing fast if the login is rejected. */
  async tokenFor(credentials: Credentials): Promise<string> {
    const response = await this.login(credentials);
    await expect(response, `login failed for ${credentials.email}`).toBeOK();
    return ((await response.json()) as LoginResponse).access_token;
  }

  register(user: NewUser): Promise<APIResponse> {
    return this.request.post('users/register', { data: user });
  }

  me(token?: string): Promise<APIResponse> {
    return this.request.get('users/me', { headers: authHeader(token) });
  }

  refresh(token: string): Promise<APIResponse> {
    return this.request.get('users/refresh', { headers: authHeader(token) });
  }

  logout(token: string): Promise<APIResponse> {
    return this.request.get('users/logout', { headers: authHeader(token) });
  }

  /** Requires an admin token. */
  deleteUser(userId: string, adminToken: string): Promise<APIResponse> {
    return this.request.delete(`users/${userId}`, { headers: authHeader(adminToken) });
  }
}

function authHeader(token?: string): Record<string, string> {
  return token ? { Authorization: `Bearer ${token}` } : {};
}
