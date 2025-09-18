import jwt from 'jsonwebtoken';
import express from 'express';

// Extend Request interface to include user data
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        clientId: string;
      };
    }
  }
}

export const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access token required'
    });
  }

  try {
    // Use the same secure JWT secret handling as auth routes
    const jwtSecret = process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' 
      ? (() => { throw new Error('JWT_SECRET is required in production'); })()
      : 'demo-secret-key-for-development-only');
    
    const decoded = jwt.verify(token, jwtSecret) as any;
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      clientId: decoded.clientId
    };
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      error: 'Invalid or expired token'
    });
  }
};

export const validateInput = (schema: any) => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const result = schema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: 'Invalid input data',
          details: result.error.issues
        });
      }
      req.body = result.data;
      next();
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'Input validation failed'
      });
    }
  };
};