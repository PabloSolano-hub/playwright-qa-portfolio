import path from 'node:path';

export const AUTH_DIR = path.join(process.cwd(), '.auth');
export const CUSTOMER_STATE = path.join(AUTH_DIR, 'customer.json');
