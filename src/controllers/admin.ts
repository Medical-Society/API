import jwt from 'jsonwebtoken';

import { NextFunction, Request, Response } from 'express';
import { createAdmin, findAdminByEmail } from '../services/admin';
import HttpException from '../models/errors';
import { LoginAdminInput, SignupAdminInput } from '../schema/admin';

const key = process.env.JWT_SECRET as string;

export const login = async (
  req: Request<{}, {}, LoginAdminInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const admin = await findAdminByEmail(req.body.email);
    if (!admin) {
      throw new HttpException(400, 'Invalid email or password');
    }
    const isMatch = admin.comparePassword(req.body.password);
    if (!isMatch) {
      throw new HttpException(400, 'Invalid email or password');
    }
    const token = jwt.sign({ _id: admin._id }, key);
    res.status(200).json({
      status: 'success',
      data: { token, admin: { name: admin.name, email: admin.email } },
    });
  } catch (err: any) {
    next(err);
  }
};

export const signup = async (
  req: Request<{}, {}, SignupAdminInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const founded = await findAdminByEmail(req.body.email);
    if (founded) {
      throw new HttpException(400, 'Admin already exists');
    }
    const admin = await createAdmin(req.body);
    res.status(201).json({
      status: 'success',
      data: { admin },
    });
  } catch (err) {
    next(err);
  }
};
