import { JwtPayload } from 'jsonwebtoken';

export interface UserPayload extends JwtPayload {
  userId: string;
  email?: string;
  [key: string]: unknown;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
      requestId?: string;
    }
  }
}

