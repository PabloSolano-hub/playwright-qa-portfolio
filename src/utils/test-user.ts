import fs from 'node:fs';
import path from 'node:path';
import type { NewUser } from '@api/types';
import { USER_FILE } from './paths';

export type TestUser = NewUser & { id: string };

export function saveTestUser(user: TestUser): void {
  fs.mkdirSync(path.dirname(USER_FILE), { recursive: true });
  fs.writeFileSync(USER_FILE, JSON.stringify(user, null, 2));
}

/** The dedicated user registered by the setup project for this run. */
export function readTestUser(): TestUser {
  if (!fs.existsSync(USER_FILE)) {
    throw new Error(`${USER_FILE} not found: run the "setup" project first.`);
  }
  return JSON.parse(fs.readFileSync(USER_FILE, 'utf8')) as TestUser;
}

export function testUserExists(): boolean {
  return fs.existsSync(USER_FILE);
}

export function removeTestUserFile(): void {
  fs.rmSync(USER_FILE, { force: true });
}
