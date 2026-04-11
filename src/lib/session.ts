
import { IronSessionOptions } from 'iron-session';

export interface SessionData {
  username?: string;
  isLoggedIn: boolean;
  allowedChains?: string[];
  aiSearchEnabled?: boolean;
  boosterEnabled?: boolean;
}

export const sessionOptions: IronSessionOptions = {
  // Iron-session requires exactly 32 characters or more.
  // Using a verified 32-character alphanumeric key.
  password: 'a-secure-32-character-password!!',
  cookieName: 'ai-crypto-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  },
};
