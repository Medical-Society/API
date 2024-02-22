import { NextFunction, Request, Response } from 'express';
import Admin from '../models/admin';

export const checkAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const admin = await Admin.findById(req.body.auth.id);
    if (!admin) {
      return res.status(401).json({
        status: 'fail',
        message: 'Unauthorized user. Admin access required.',
      });
    }
    next();
  } catch (err) {
    res
      .status(500)
      .json({ status: 'fail', error: err, message: 'Error in checking admin' });
  }
};
