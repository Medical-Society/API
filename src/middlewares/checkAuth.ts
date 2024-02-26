import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const key = process.env.JWT_SECRET as string;

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res
        .status(401)
        .json({ status: 'fail', message: 'Please login first' });
    }

    // jwt verify with typescript
    const decoded = jwt.verify(token, key) as JwtPayload;
    if (!decoded) {
      return res.status(401).json({ status: 'fail', message: 'Invalid token' });
    }

    // Attach the decoded payload to the request for later use if needed
    req.body.auth = { id: decoded._id }
    // Call next to pass control to the next middleware
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res
      .status(401)
      .json({ status: 'fail', message: 'Authentication failed' });
  }
};
