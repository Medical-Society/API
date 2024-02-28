// Third party modules
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';

// local modules
import { Status } from '../models/enums';
import { Request, Response } from 'express';
import {
  ChangeDoctorStatusInput,
  DeleteDoctorInput,
  DeleteMyDoctorInput,
  ForgotPasswordDoctorInput,
  GetAllDoctorsInput,
  GetDoctorInput,
  LoginDoctorInput,
  ResetPasswordDoctorInput,
  SignupDoctorInput,
  UpdateDoctorInput,
  UpdateDoctorPasswordInput,
  VerifyDoctorInput,
  SearchDoctorInput,
} from '../schema/doctor';
import {
  createDoctor,
  findDoctorByEmail,
  findDoctorById,
  findDoctorByIdAndDelete,
  findDoctorByIdAndUpdate,
  findDoctorsPagination,
  findDoctor,
  addReviewForDoctorById,
  findDoctorReviewsById,
} from '../services/doctor';
import {
  sendResetPasswordEmail,
  sendVerificationEmail,
} from '../services/mailing';
import { AddReviewBodyInput, AddReviewParamsInput } from '../schema/review';
import { SaveImageInput } from '../schema/customZod';

const key: string = process.env.JWT_SECRET as string;

export const signup = async (
  req: Request<{}, {}, SignupDoctorInput>,
  res: Response,
) => {
  try {
    const doctor = await createDoctor(req.body);
    const token = jwt.sign({ _id: doctor._id }, key, { expiresIn: '1d' });
    sendVerificationEmail(doctor.email, token, 'doctors');
    res.status(201).json({
      status: 'success',
      message: `Dr. ${doctor.englishFullName} signed up successfully, Please verify your email`,
    });
  } catch (err: any) {
    if (err.code === 11000) {
      return res.status(409).send('Account already exist');
    }
    res
      .status(500)
      .json({ status: 'fail', error: err, message: 'Error in doctor signup' });
  }
};

export const login = async (
  req: Request<{}, {}, LoginDoctorInput>,
  res: Response,
) => {
  try {
    const doctor = await findDoctorByEmail(req.body.email);
    if (!doctor) {
      return res
        .status(400)
        .json({ status: 'fail', message: 'Invalid email or password' });
    }
    // console.log(doctor.password);
    const isMatch = await doctor.comparePassword(req.body.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ status: 'fail', message: 'Invalid email or password' });
    }

    if (!doctor.isVerified) {
      return res
        .status(400)
        .json({ status: 'fail', message: 'Please verify your email' });
    }

    if (doctor.status !== Status.ACCEPTED) {
      return res
        .status(400)
        .json({ status: 'fail', message: 'Your account is not accepted yet' });
    }
    const token = jwt.sign({ _id: doctor._id }, key);
    const { password: _, ...result } = doctor.toObject();
    res.status(200).json({
      status: 'success',
      data: { token, result },
    });
  } catch (err) {
    res
      .status(500)
      .json({ status: 'fail', error: err, message: 'Error in doctor login' });
  }
};

export const verifyEmail = async (
  req: Request<VerifyDoctorInput>,
  res: Response,
) => {
  try {
    const decoded = jwt.verify(req.params.token, key) as JwtPayload;
    const doctor = await findDoctorById(decoded._id);
    if (!doctor) {
      return res.status(401).send('Invalid token');
    }
    if (doctor.isVerified) {
      return res.status(400).send('Email already verified');
    }
    doctor.isVerified = true;
    await doctor.save();
    res.status(200).send('Email verified successfully');
  } catch (err: any) {
    if (err.name === 'CastError') {
      return res.status(401).send('Invalid token');
    }
    res.status(500).json({
      status: 'fail',
      error: err,
      message: 'Error in verifying email',
    });
  }
};

export const getAllDoctors = async (
  req: Request<{}, {}, {}, GetAllDoctorsInput>,
  res: Response,
) => {
  try {
    const data = await findDoctorsPagination(
      {},
      req.query.page,
      req.query.limit,
    );
    res.status(200).json({
      status: 'success',
      data,
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      error: err,
      message: 'Error in getting all doctors',
    });
  }
};

export const getDoctor = async (
  req: Request<GetDoctorInput>,
  res: Response,
) => {
  try {
    const doctor = await findDoctorById(req.params.id, { password: 0 });
    if (!doctor) {
      return res
        .status(404)
        .json({ status: 'fail', message: 'Doctor not found' });
    }
    res.status(200).json({ status: 'success', data: { doctor } });
  } catch (err: any) {
    if (err.name === 'CastError') {
      return res.status(404).send('Doctor not found');
    }
    res
      .status(500)
      .json({ status: 'fail', error: err, message: 'Error in getting doctor' });
  }
};

export const forgotPassword = async (
  req: Request<{}, {}, ForgotPasswordDoctorInput>,
  res: Response,
) => {
  try {
    const { email } = req.body;
    const doctor = await findDoctorByEmail(email);
    if (!doctor) {
      return res.status(200).json({
        status: 'success',
        message: `If the email: ${email} exists in the system, a reset password link will be sent to it`,
      });
    }
    const secret = doctor.password + '-' + key;
    const token = jwt.sign({ _id: doctor._id }, secret, { expiresIn: '15m' });
    sendResetPasswordEmail(doctor.email, token, 'doctors');
    res.status(200).json({
      status: 'success',
      message: `Reset password link sent to ${doctor.email}`,
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      error: err,
      message: 'Error in forgot password',
    });
  }
};

export const resetPassword = async (
  req: Request<{}, {}, ResetPasswordDoctorInput>,
  res: Response,
) => {
  try {
    const { token, password } = req.body;
    const decoded = jwt.decode(token);
    if (typeof decoded === 'string' || !decoded?._id) {
      return res.status(401).json({ status: 'fail', message: 'Invalid token' });
    }
    const doctor = await findDoctorById(decoded._id);
    if (!doctor) {
      return res.status(401).json({ status: 'fail', message: 'Invalid token' });
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
    console.log({ err: JSON.parse(JSON.stringify(err)) });
    if (err.name === 'CastError') {
      return res.status(401).send('Invalid token');
    }
    res
      .status(500)
      .json({ status: 'fail', error: err, message: 'Error in reset password' });
  }
};

export const changeStatus = async (
  req: Request<
    ChangeDoctorStatusInput['params'],
    {},
    ChangeDoctorStatusInput['body']
  >,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const doctor = await findDoctorById(id);
    if (!doctor) {
      return res
        .status(404)
        .json({ status: 'fail', message: 'Doctor not found' });
    }
    doctor.status = status;
    await doctor.save();
    res.status(200).json({
      status: 'success',
      message: `Dr. ${doctor.englishFullName} status changed to ${status}`,
    });
  } catch (err: any) {
    // use a standardized error handling middleware
    if (err.name === 'CastError') {
      return res.status(404).send('Doctor not found');
    }
    res.status(500).json({
      status: 'fail',
      error: err,
      message: 'Error in changing status',
    });
  }
};

export const deleteDoctor = async (
  req: Request<DeleteDoctorInput>,
  res: Response,
) => {
  try {
    const doctor = await findDoctorByIdAndDelete(req.params.id);
    if (!doctor) {
      return res
        .status(404)
        .json({ status: 'fail', message: 'Doctor not found' });
    }
    res
      .status(204)
      .json({ status: 'success', message: 'Doctor deleted successfully' });
  } catch (err: any) {
    if (err.name === 'CastError') {
      return res.status(404).send('Doctor not found');
    }
    res.status(500).json({
      status: 'fail',
      error: err,
      message: 'Error in deleting doctor',
    });
  }
};

export const update = async (
  req: Request<{}, {}, UpdateDoctorInput>,
  res: Response,
) => {
  try {
    const doctor = await findDoctorByIdAndUpdate(
      req.body.auth.id,
      req.body,
    ).select('-password');
    res.status(200).json({ status: 'success', data: { doctor } });
  } catch (err: any) {
    if (err.name === 'CastError') {
      return res.status(401).send('Invalid token');
    }
    res.status(500).json({
      status: 'fail',
      error: err,
      message: 'Error in updating doctor',
    });
  }
};

export const deleteMyAccount = async (
  req: Request<{}, {}, DeleteMyDoctorInput>,
  res: Response,
) => {
  try {
    await findDoctorByIdAndDelete(req.body.auth.id);
    res
      .status(204)
      .json({ status: 'success', message: 'Doctor deleted successfully' });
  } catch (err: any) {
    if (err.name === 'CastError') {
      return res.status(401).send('Invalid token');
    }
    res.status(500).json({
      status: 'fail',
      error: err,
      message: 'Error in deleting doctor my account',
    });
  }
};

export const changePassword = async (
  req: Request<{}, {}, UpdateDoctorPasswordInput>,
  res: Response,
) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const doctor = await findDoctorById(req.body.auth.id);
    if (!doctor) {
      return res
        .status(404)
        .json({ status: 'fail', message: 'Doctor not found' });
    }
    const isMatch = await bcrypt.compare(oldPassword, doctor.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ status: 'fail', message: 'Invalid old password' });
    }
    doctor.password = newPassword;
    await doctor.save();
    res
      .status(200)
      .json({ status: 'success', message: 'Password changed successfully' });
  } catch (err: any) {
    if (err.name === 'CastError') {
      return res.status(401).send('Invalid token');
    }
    res.status(500).json({
      status: 'fail',
      error: err,
      message: 'Error in changing password',
    });
  }
};

export const searchDoctor = async (
  req: Request<{}, {}, {}, SearchDoctorInput>,
  res: Response,
) => {
  try {
    const doctor = await findDoctor(
      {},
      req.query.englishFullName,
      req.query.specialization,
      req.query.clinicAddress,
      req.query.page,
      req.query.limit,
    );
    console.log(doctor);
    if (!doctor) {
      return res.status(404).json({
        status: 'fail',
        message: 'Doctor not found!!',
      });
    }
    return res.status(200).json({ status: 'success', doctor });
  } catch (err: any) {
    console.log({ err: JSON.parse(JSON.stringify(err)) });
    if (err.name === 'CastError') {
      return res.status(401).send('Invalid token');
    }
    res.status(500).json({
      status: 'fail',
      error: err,
      message: 'Error Search Dcotor Name',
    });
  }
};

export const addReview = async (
  req: Request<AddReviewParamsInput, {}, AddReviewBodyInput>,
  res: Response,
) => {
  try {
    const review = await addReviewForDoctorById(
      req.params.id,
      req.body.auth.id,
      req.body,
    );

    if (!review) {
      return res.status(400).json({
        status: 'fail',
        message: 'Patient or Doctor not found',
      });
    }
    res.status(201).json({ status: 'success', data: { review } });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'fail',
      error: err,
      message: 'Error in adding review',
    });
  }
};

export const getReviews = async (
  req: Request<AddReviewParamsInput>,
  res: Response,
) => {
  try {
    const data = await findDoctorReviewsById(req.params.id);
    res.status(200).json({ status: 'success', data });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      error: err,
      message: 'Error in getting reviews',
    });
  }
};

export const saveProfileImage = async (
  req: Request<{}, {}, SaveImageInput>,
  res: Response,
) => {
  try {
    const doctor = await findDoctorByIdAndUpdate(req.body.auth.id, {
      avatar: req.body.imageURL,
    });
    return res.status(200).json({
      status: 'success',
      data: doctor,
    });
  } catch (err: any) {
    console.log({ err: JSON.parse(JSON.stringify(err)) });

    return res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
};
