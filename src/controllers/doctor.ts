// Third party modules
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';

// local modules
import { Status } from '../models/enums';
import { NextFunction, Request, Response } from 'express';
import {
  ChangeDoctorStatusInput,
  DeleteDoctorInput,
  DeleteMyDoctorInput,
  ForgotPasswordDoctorInput,
  GetDoctorInput,
  LoginDoctorInput,
  ResetPasswordDoctorInput,
  SignupDoctorInput,
  UpdateDoctorInput,
  UpdateDoctorPasswordInput,
  VerifyDoctorInput,
  SearchDoctorInputQuery,
  SaveDoctorAvatarBody,
  SearchDoctorInputBody,
} from '../schema/doctor';
import {
  createDoctor,
  findDoctorByEmail,
  findDoctorById,
  findDoctorByIdAndDelete,
  findDoctorByIdAndUpdate,
  findDoctors,
} from '../services/doctor';
import {
  sendResetPasswordEmail,
  sendVerificationEmail,
} from '../services/mail';
import HttpException from '../models/errors';
import PatientModel from '../models/patient';
import AdminModel from '../models/admin';
import DoctorModel from '../models/doctor';

const key: string = process.env.JWT_SECRET as string;

export const signup = async (
  req: Request<{}, {}, SignupDoctorInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const doctor = await createDoctor(req.body);
    const token = jwt.sign({ _id: doctor._id }, key, { expiresIn: '15m' });
    sendVerificationEmail(doctor.email, token, 'doctors');
    res.status(201).json({
      status: 'success',
      message: `Dr. ${doctor.englishFullName} signed up successfully, Please verify your email`,
    });
  } catch (err: any) {
    next(err);
  }
};

export const login = async (
  req: Request<{}, {}, LoginDoctorInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const doctor = await findDoctorByEmail(req.body.email);
    if (!doctor) {
      throw new HttpException(400, 'Invalid email or password', [
        'Email or password is incorrect',
      ]);
    }
    // console.log(doctor.password);
    const isMatch = await doctor.comparePassword(req.body.password);
    if (!isMatch) {
      throw new HttpException(400, 'Invalid email or password', [
        'Email or password is incorrect',
      ]);
    }

    if (!doctor.isVerified) {
      throw new HttpException(400, 'Please verify your email', [
        'Please verify your email',
      ]);
    }

    if (doctor.status !== Status.ACCEPTED) {
      throw new HttpException(400, 'Your account is not accepted yet', [
        'Your account is not accepted yet',
      ]);
    }
    const token = jwt.sign({ _id: doctor._id }, key);
    const { password: _, ...result } = doctor.toObject();
    res.status(200).json({
      status: 'success',
      data: { token, result },
    });
  } catch (err: any) {
    next(err);
  }
};

export const verifyDoctorInfo = async (
  req: Request<{}, {}, VerifyDoctorInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const doctor = await findDoctorById(req.body.auth.id);
    if (!doctor) {
      throw new HttpException(400, 'Invalid token', ['Invalid token']);
    }

    doctor.completeImages = req.body.images || [];

    doctor.isVerified = true;

    await doctor.save();
    console.log(req.body.images);
    res.status(200).json({
      status: 'success',
      data: {
        message: 'Email verified successfully. Please wait for admin approval.',
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const forgotPassword = async (
  req: Request<{}, {}, ForgotPasswordDoctorInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.body;
    const doctor = await findDoctorByEmail(email);
    if (doctor) {
      const secret = doctor.password + '-' + key;
      const token = jwt.sign({ _id: doctor._id }, secret, { expiresIn: '15m' });
      sendResetPasswordEmail(doctor.email, token, 'doctors');
    }
    res.status(200).json({
      status: 'success',
      message: `If the email: ${email} exists in the system, a reset password link will be sent to it`,
    });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (
  req: Request<{}, {}, ResetPasswordDoctorInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { token, password } = req.body;
    const decoded = jwt.decode(token);
    if (typeof decoded === 'string' || !decoded?._id) {
      throw new HttpException(400, 'Invalid token', ['Invalid token']);
    }
    const doctor = await findDoctorById(decoded._id);
    if (!doctor) {
      throw new HttpException(400, 'Invalid token', ['Invalid token']);
    }
    const secret = doctor.password + '-' + key;
    jwt.verify(token, secret);
    doctor.password = password;
    await doctor.save();
    res.status(200).json({
      status: 'success',
      message: `Dr. ${doctor.englishFullName} password reset successfully`,
    });
  } catch (err: any) {
    next(err);
  }
};

export const changeStatus = async (
  req: Request<
    ChangeDoctorStatusInput['params'],
    {},
    ChangeDoctorStatusInput['body']
  >,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { doctorId } = req.params;
    const { status } = req.body;
    const doctor = await findDoctorById(doctorId);
    if (!doctor) {
      throw new HttpException(404, 'Doctor not found', ['Doctor not found']);
    }
    doctor.status = status;
    await doctor.save();
    res.status(200).json({
      status: 'success',
      message: `Dr. ${doctor.englishFullName} status changed to ${status}`,
    });
  } catch (err: any) {
    next(err);
  }
};

export const deleteDoctor = async (
  req: Request<DeleteDoctorInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    await findDoctorByIdAndDelete(req.params.doctorId);

    res
      .status(204)
      .json({ status: 'success', message: 'Doctor deleted successfully' });
  } catch (err: any) {
    next(err);
  }
};

export const update = async (
  req: Request<{}, {}, UpdateDoctorInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const doctor = await findDoctorByIdAndUpdate(
      req.body.auth.doctorId,
      req.body,
    ).select('-password');
    res.status(200).json({ status: 'success', data: { doctor } });
  } catch (err: any) {
    next(err);
  }
};

export const deleteMyAccount = async (
  req: Request<{}, {}, DeleteMyDoctorInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    await findDoctorByIdAndDelete(req.body.auth.doctorId);
    res
      .status(204)
      .json({ status: 'success', message: 'Doctor deleted successfully' });
  } catch (err: any) {
    next(err);
  }
};

export const changePassword = async (
  req: Request<{}, {}, UpdateDoctorPasswordInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const doctor = await findDoctorById(req.body.auth.doctorId);
    if (!doctor) {
      throw new HttpException(404, 'Invalid Token', []);
    }
    const isMatch = await bcrypt.compare(oldPassword, doctor.password);
    if (!isMatch) {
      throw new HttpException(
        400,
        'Password is incorrect please try again',
        [],
      );
    }
    doctor.password = newPassword;
    await doctor.save();
    res
      .status(200)
      .json({ status: 'success', message: 'Password changed successfully' });
  } catch (err: any) {
    next(err);
  }
};

export const searchDoctor = async (
  req: Request<{}, {}, SearchDoctorInputBody, SearchDoctorInputQuery>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const patient = await PatientModel.findById(req.body.auth.id);
    const admin = await AdminModel.findById(req.body.auth.id);
    const doctor = await DoctorModel.findById(req.body.auth.id);
    if (!(patient || doctor || admin))
      throw new HttpException(400, 'You are not allowed to do this task', [
        'You are not allowed to do this task',
      ]);

    const data = await findDoctors({}, req.query, !!admin);

    return res.status(200).json({ status: 'success', data });
  } catch (err: any) {
    next(err);
  }
};

export const getDoctor = async (
  req: Request<GetDoctorInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const doctor = await findDoctorById(req.params.doctorId, { password: 0 });
    if (!doctor) {
      throw new HttpException(404, 'Doctor not found', ['Doctor not found']);
    }
    res.status(200).json({ status: 'success', data: { doctor } });
  } catch (err: any) {
    next(err);
  }
};

export const saveProfileImage = async (
  req: Request<{}, {}, SaveDoctorAvatarBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const doctor = await findDoctorByIdAndUpdate(req.body.auth.doctorId, {
      avatar: req.body.imageURL,
    }).select('-password');
    return res.status(200).json({
      status: 'success',
      data: doctor,
    });
  } catch (err: any) {
    next(err);
  }
};
