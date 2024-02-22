import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { Request, Response } from 'express';
import { createAdmin, findAdminByEmail } from '../services/admin';

const key = process.env.JWT_SECRET as string;

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const admin = await findAdminByEmail(email);
    if (!admin) {
      return res
        .status(400)
        .json({ status: 'fail', message: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ status: 'fail', message: 'Invalid email or password' });
    }
    const token = jwt.sign({ _id: admin._id }, key);
    res.status(200).json({
      status: 'success',
      data: { token, admin: { name: admin.name, email: admin.email } },
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ status: 'fail', error: err, message: 'Error in admin login' });
  }
};

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ status: 'fail', message: 'You must fill all fields' });
    }
    const founded = await findAdminByEmail(email);
    if (founded) {
      return res
        .status(400)
        .json({ status: 'fail', message: 'Admin already exists' });
    }
    if (password.length < 8) {
      return res.status(400).json({
        status: 'fail',
        message: 'password must be more than 8 characters',
      });
    }
    req.body.password = await bcrypt.hash(req.body.password, 10);
    const admin = await createAdmin(req.body);
    res.status(201).json({
      status: 'success',
      data: { admin },
    });
  } catch (err) {
    res
      .status(500)
      .json({ status: 'fail', error: err, message: 'Error in admin signup' });
  }
};
