import { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

import {
  GetAllPatientInput,
  GetPatientInput,
  DeletePatientInput,
  SignupPatientInput,
  LoginPatientInput,
  VerifyEmailPatientInput,
  UpdatePatientInput,
  ResetPasswordPatientInput,
  ForgotPasswordPatientInput,
  ChangePasswordPatientInput,
  DeleteMyAccountPatientInput,
  SaveImagePatientInput,
} from '../schema/patient';

import {
  findPatientByEmail,
  createPatient,
  findPatientById,
  findpatientsPagination,
  findPatientByIdAndUpdate,
  findPatientByIdAndDelete,
} from '../services/patient';

import {
  sendVerificationEmail,
  sendResetPasswordEmail,
} from '../services/mailing';

// For Admin

export const getAllPatient = async (
  req: Request<{}, {}, {}, GetAllPatientInput>,
  res: Response,
) => {
  try {
    const data = await findpatientsPagination(
      {},
      req.query.page,
      req.query.limit,
    );
    if (data.patients.length === 0) {
      return res
        .status(404)
        .json({ status: 'fail', message: 'No doctors found' });
    }
    return res.status(200).json({
      status: 'success',
      results: data.patients.length,
      data,
    });
  } catch (err: any) {
    return res.status(500).json({
      status: 'fail',
      message: 'Error in Get All Patient',
    });
  }
};

// get Patient

export const getPatient = async (
  req: Request<GetPatientInput>,
  res: Response,
) => {
  try {
    const patient = await findPatientById(req.params.id);
    if (!patient) {
      return res.status(404).json({
        status: 'fail',
        message: 'Patient not found!!',
      });
    }
    return res.status(200).json({
      status: 'success',
      data: {
        patient,
      },
    });
  } catch (err) {
    return res.status(500).json({
      status: 'fail',
      message: 'error in getting patient',
    });
  }
};
export const deletePatient = async (
  req: Request<DeletePatientInput>,
  res: Response,
) => {
  try {
    const patient = await findPatientByIdAndDelete(req.params.id);
    if (!patient) {
      return res.status(404).json({
        status: 'fail',
        message: 'Patient not found!!',
      });
    }
    return res.status(204).json({});
  } catch (err) {
    return res.status(500).json({
      status: 'fail',
      message: 'error in deleting patient',
    });
  }
};

// For Patient

// sign up
const key: string = process.env.JWT_SECRET as string;

export const signUp = async (
  req: Request<{}, {}, SignupPatientInput>,
  res: Response,
) => {
  const body = req.body;

  try {
    const patient = await createPatient(body);

    const token = jwt.sign({ _id: patient._id }, key);
    if (!token) {
      return res
        .status(500)
        .json({ status: 'fail', message: 'Error in token generation' });
    }
    sendVerificationEmail(patient.email, token, 'patients');
    return res.status(201).json({
      status: 'success',
      message: `${patient.patientName} Sign up successfully ,please verify your email`,
    });
  } catch (err: any) {
    if (err.code === 11000) {
      return res.status(409).send('Account already exists');
    }

    res
      .status(500)
      .json({ status: 'fail', error: err, message: 'Error in patient signup' });
  }
};

// login

export const login = async (
  req: Request<{}, {}, LoginPatientInput>,
  res: Response,
) => {
  try {
    const patient = await findPatientByEmail(req.body.email);
    if (!patient) {
      return res
        .status(400)
        .json({ status: 'fail', message: 'Invalid  Email' });
    }
    console.log(patient.password);
    const isMatch = await patient.comparePassword(req.body.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ status: 'fail', message: 'Invalid password' });
    }

    if (!patient.isVerified) {
      return res
        .status(400)
        .json({ status: 'fail', message: 'Please verify your email' });
    }

    const token = jwt.sign({ _id: patient._id }, key);
    const { password: _, ...result } = patient.toObject();
    res.status(200).json({
      status: 'success',
      data: { token, result },
    });
  } catch (err) {
    res
      .status(500)
      .json({ status: 'fail', error: err, message: 'Error in patient login' });
  }
};

// verify Email

export const verifyEmail = async (
  req: Request<VerifyEmailPatientInput>,
  res: Response,
) => {
  try {
    const decode = jwt.verify(req.params.token, key) as JwtPayload;
    const patient = await findPatientById(decode._id);
    if (!patient) {
      return res
        .status(400)
        .json({ status: 'fail', message: 'Patient not found' });
    }
    if (patient.isVerified) {
      return res
        .status(400)
        .json({ status: 'fail', message: 'Email is Already Verified' });
    }
    patient.isVerified = true;
    await patient.save();
    res
      .status(200)
      .json({ status: 'success', message: 'Patient verified successfully' });
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

// forgor password
export const forgotPassword = async (
  req: Request<{}, {}, ForgotPasswordPatientInput>,
  res: Response,
) => {
  try {
    const { email } = req.body;
    const patient = await findPatientByEmail(email);
    if (!patient) {
      // send 200 for not exist email to prevent email enumeration
      return res.status(200).json({
        status: 'success',
        message: `Reset password link sent to ${email}`,
      });
    }
    const secret = patient.password + '-' + key;
    const token = jwt.sign({ _id: patient._id }, secret, { expiresIn: '15m' });
    if (!token) {
      return res
        .status(500)
        .json({ status: 'fail', message: 'Error in token generation' });
    }
    sendResetPasswordEmail(patient.email, token, 'patients');
    res.status(200).json({
      status: 'success',
      message: `Reset password link sent to ${patient.email}`,
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      error: err,
      message: 'Error in forgot password',
    });
  }
};

// Reset password

export const resetPassword = async (
  req: Request<{}, {}, ResetPasswordPatientInput>,
  res: Response,
) => {
  try {
    const { token, password } = req.body;

    const decoded = jwt.decode(token) as JwtPayload;
    console.log(decoded._id);
    if (!decoded?._id) {
      return res.status(401).json({ status: 'fail', message: 'Invalid token' });
    }
    const patient = await findPatientById(decoded._id);
    if (!patient) {
      return res.status(401).json({ status: 'fail', message: 'Invalid token' });
    }
    const secret = patient.password + '-' + key;
    jwt.verify(token, secret);
    console.log(password);
    patient.password = password;
    await patient.save();
    res.status(200).json({
      status: 'success',
      message: `${patient.patientName} password reset successfully`,
    });
  } catch (err: any) {
    // console.log({ err: JSON.parse(JSON.stringify(err)) });
    if (err.name === 'CastError') {
      return res.status(401).send('Invalid token');
    }
    res.status(500).json({
      status: 'fail',
      error: err.message,
      message: 'Error in reset password',
    });
  }
};

// update Me

export const updateMe = async (
  req: Request<{}, {}, UpdatePatientInput>,
  res: Response,
) => {
  try {
    const patient = await findPatientByIdAndUpdate(
      req.body.auth.id,
      req.body,
    ).select('-password');

    return res.status(200).json({
      status: 'success',
      data: {
        patient,
      },
    });
  } catch (err: any) {
    console.log({ err: JSON.parse(JSON.stringify(err)) });
    if (err.name === 'CastError') {
      return res.status(401).send('Invalid token');
    }
    res
      .status(500)
      .json({ status: 'fail', error: err, message: 'Error in Update Patient' });
  }
};
// change password

export const changePassword = async (
  req: Request<{}, {}, ChangePasswordPatientInput>,
  res: Response,
) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const patient = await findPatientById(req.body.auth.id);
    if (!patient) {
      return res.status(404).json({
        status: 'fail',
        message: 'Patient not found!!',
      });
    }
    const isMatch = await patient.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid password',
      });
    }
    patient.password = newPassword;
    patient.save();
    res
      .status(200)
      .json({ status: 'success', message: 'Password changed successfully' });
  } catch (err: any) {
    console.log({ err: JSON.parse(JSON.stringify(err)) });
    if (err.name === 'CastError') {
      return res.status(401).send('Invalid token');
    }
    res.status(500).json({
      status: 'fail',
      error: err,
      message: 'Error in Change Password',
    });
  }
};

// Delete My Account

export const deleteMyAccount = async (
  req: Request<{}, {}, DeleteMyAccountPatientInput>,
  res: Response,
) => {
  try {
    const patient = await findPatientByIdAndDelete(req.body.auth.id);
    if (!patient) {
      return res.status(404).json({
        status: 'fail',
        message: 'Patient not found!!',
      });
    }
    return res
      .status(204)
      .json({ status: 'success', message: 'You Are deleted successfully' });
  } catch (err: any) {
    console.log({ err: JSON.parse(JSON.stringify(err)) });
    if (err.name === 'CastError') {
      return res.status(401).send('Invalid token');
    }
    res.status(500).json({
      status: 'fail',
      error: err,
      message: 'Error in Delete My Account',
    });
  }
};
// Save image
export const saveProfileImage = async (
  req: Request<{}, {}, SaveImagePatientInput>,
  res: Response,
) => {
  try {
    const patient = await findPatientByIdAndUpdate(req.body.auth.id, {
      avatar: req.body.imageURL,
    });
    return res.status(200).json({
      status: 'success',
      data: patient,
    });
  } catch (err: any) {
    console.log({ err: JSON.parse(JSON.stringify(err)) });

    return res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
};
