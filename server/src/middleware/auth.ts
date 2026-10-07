import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest, AuthUserPayload, UserRole } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'gram_panchayat_fallback_secret_key_2026';

export function generateToken(payload: AuthUserPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      message: 'Authentication required. Please log in to continue.',
    });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUserPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired session. Please log in again.',
    });
    return;
  }
}

export function requireRole(...allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Access denied: You do not have permission to access this resource.',
      });
      return;
    }

    next();
  };
}
