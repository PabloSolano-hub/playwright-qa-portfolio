import path from 'node:path';

export const AUTH_DIR = path.join(process.cwd(), '.auth');
/** Browser storage state of the dedicated test user, written by the setup project. */
export const USER_STATE = path.join(AUTH_DIR, 'user-state.json');
/** Credentials and id of the dedicated test user, written by the setup project. */
export const USER_FILE = path.join(AUTH_DIR, 'user.json');
