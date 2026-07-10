export const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
export const JWT_EXPIRES_IN = '7d';
export const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days
export const BCRYPT_SALT_ROUNDS = 10;
