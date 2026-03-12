
import { IronSessionOptions } from 'iron-session';

export interface SessionData {
  username?: string;
  isLoggedIn: boolean;
  allowedChains?: string[];
}

export const sessionOptions: IronSessionOptions = {
  password: 'ai-crypto-v4-master-encryption-secret-32-chars',
  cookieName: 'ai-crypto-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
  },
};
