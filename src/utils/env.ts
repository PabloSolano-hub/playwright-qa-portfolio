import 'dotenv/config';

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable "${name}". Copy .env.example to .env.`);
  }
  return value;
}

export const env = {
  baseUrl: required('BASE_URL'),
  apiUrl: required('API_URL'),
  // Only used for cleanup (deleting users created by the suite). Tests never send a wrong
  // password to a shared account: 3 failed logins lock it for every visitor of the site.
  admin: {
    email: required('ADMIN_EMAIL'),
    password: required('ADMIN_PASSWORD'),
  },
} as const;

export interface Credentials {
  email: string;
  password: string;
}
