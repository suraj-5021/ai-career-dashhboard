import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'careeros_secret_key_123_456_789';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export function protect(req: AuthRequest, res: Response, next: NextFunction): void {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'Not authorized, token missing' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Not authorized, token verification failed' });
    return;
  }
}

export function adminOnly(req: AuthRequest, res: Response, next: NextFunction): void {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Access denied: Admin role required' });
  }
}
