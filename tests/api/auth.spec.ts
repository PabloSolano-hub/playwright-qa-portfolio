import { expect, test } from '@fixtures/test';
import type { LoginResponse, User } from '@api/types';
import { buildUser } from '@data/user';

// Every test uses its own registered user: wrong passwords against a shared account
// would lock it (3 failed attempts) for the whole suite and for other visitors.
test.describe('Auth API', () => {
  test('@ESC-API-AUTH-001 login with valid credentials returns a bearer token', async ({
    authApi,
    registeredUser,
  }) => {
    const response = await authApi.login(registeredUser);

    expect(response.status()).toBe(200);
    const body = (await response.json()) as LoginResponse;
    expect(body.token_type).toBe('bearer');
    expect(body.expires_in).toBe(300);
    expect(body.access_token).toMatch(/^[\w-]+\.[\w-]+\.[\w-]+$/);
  });

  test('@ESC-API-AUTH-002 login with a wrong password is rejected', async ({
    authApi,
    registeredUser,
  }) => {
    const response = await authApi.login({ ...registeredUser, password: 'wrong-password' });

    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual({ error: 'Unauthorized' });
  });

  test('@ESC-API-AUTH-003 profile is returned only to authenticated users', async ({
    authApi,
    registeredUser,
  }) => {
    const anonymous = await authApi.me();
    expect(anonymous.status()).toBe(401);

    const token = await authApi.tokenFor(registeredUser);
    const authenticated = await authApi.me(token);
    expect(authenticated.status()).toBe(200);
    expect((await authenticated.json()) as User).toMatchObject({
      id: registeredUser.id,
      email: registeredUser.email,
    });
  });

  test('@ESC-API-AUTH-004 a newly registered user can log in', async ({ authApi, cleanup }) => {
    const user = buildUser();

    const registration = await authApi.register(user);
    expect(registration.status()).toBe(201);
    const created = (await registration.json()) as User;
    cleanup.user(created.id);
    expect(created).toMatchObject({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    });
    expect(created).not.toHaveProperty('password');

    const token = await authApi.tokenFor(user);
    expect((await (await authApi.me(token)).json()) as User).toMatchObject({ id: created.id });
  });

  test('@ESC-API-AUTH-005 registering an existing email is rejected', async ({
    authApi,
    registeredUser,
  }) => {
    const response = await authApi.register(buildUser({ email: registeredUser.email }));

    expect(response.status()).toBe(409);
    expect(await response.json()).toEqual({
      email: ['A customer with this email address already exists.'],
    });
  });

  test('@ESC-API-AUTH-006 logout invalidates the token', async ({ authApi, registeredUser }) => {
    const token = await authApi.tokenFor(registeredUser);
    expect((await authApi.me(token)).status()).toBe(200);

    const logout = await authApi.logout(token);
    expect(logout.status()).toBe(200);
    expect((await authApi.me(token)).status()).toBe(401);
  });

  test('@ESC-API-AUTH-007 the account is locked after three failed logins', async ({
    authApi,
    registeredUser,
  }) => {
    const wrong = { ...registeredUser, password: 'wrong-password' };
    for (let attempt = 1; attempt <= 3; attempt++) {
      expect((await authApi.login(wrong)).status(), `failed attempt ${attempt}`).toBe(401);
    }

    const locked = await authApi.login(wrong);
    expect(locked.status()).toBe(423);
    expect(await locked.json()).toEqual({
      error: 'Account locked, too many failed attempts. Please contact the administrator.',
    });

    // Once locked, even the correct password is refused.
    expect((await authApi.login(registeredUser)).status()).toBe(423);
  });
});
