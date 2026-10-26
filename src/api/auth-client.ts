import { expect, type APIRequestContext } from '@playwright/test';
import type { Credentials } from '@utils/env';

interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export class AuthClient {
  constructor(private readonly request: APIRequestContext) {}

  async login({ email, password }: Credentials): Promise<LoginResponse> {
    const response = await this.request.post('users/login', { data: { email, password } });
    await expect(response, `login failed for ${email}`).toBeOK();
    return (await response.json()) as LoginResponse;
  }
}
