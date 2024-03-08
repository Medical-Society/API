import { NextFunction, Request, Response } from 'express';
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
  MyInfoPatientInput,
} from '../schema/patient';

import {
  findPatientByEmail,
  createPatient,
  findPatientById,
  findpatientsPagination,
  findPatientByIdAndUpdate,
  findPatientByIdAndDelete,
  createPatientComment,
  findCommentByIdAndDelete,
  editPatientComment,
  unlikePatientPost,
  LikePatientPost,
} from '../services/patient';

import {
  sendVerificationEmail,
  sendResetPasswordEmail,
} from '../services/mailing';
import { SaveImageInput } from '../schema/customZod';
import HttpException from '../models/errors';
import { R } from 'vitest/dist/reporters-MmQN-57K';
import {
  CreateCommentBodyInput,
  CreateCommentParamsInput,
  DeleteCommentBodyInput,
  DeleteCommentParamsInput,
  EditCommentBodyInput,
  EditCommentParamsInput,
} from '../schema/comment';
import {
  LikePatientPostBodyInput,
  LikePatientPostParamsInput,
} from '../schema/likes';

// For Admin

export const getAllPatient = async (
  req: Request<{}, {}, {}, GetAllPatientInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await findpatientsPagination(
      {},
      req.query.page,
      req.query.limit,
    );
    if (data.patients.length === 0) {
      throw new HttpException(404, 'No Patient Found', ['Patient NOt found ']);
    }
    return res.status(200).json({
      status: 'success',
      data,
    });
  } catch (err: any) {
    next(err);
  }
};

// get Patient

export const getPatient = async (
  req: Request<GetPatientInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const patient = await findPatientById(req.params.id);
    if (!patient) {
      throw new HttpException(404, 'Patient not found', ['Patient Not Found']);
    }
    return res.status(200).json({
      status: 'success',
      data: {
        patient,
      },
    });
  } catch (err: any) {
    next(err);
  }
};
export const deletePatient = async (
  req: Request<DeletePatientInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    await findPatientByIdAndDelete(req.params.id);
    return res.status(204).json({});
  } catch (err: any) {
    next(err);
  }
};

// For Patient

// sign up
const key: string = process.env.JWT_SECRET as string;

export const signUp = async (
  req: Request<{}, {}, SignupPatientInput>,
  res: Response,
  next: NextFunction,
) => {
  const body = req.body;

  try {
    const patient = await createPatient(body);

    const token = jwt.sign({ _id: patient._id }, key, { expiresIn: '15m' });
    if (!token) {
      throw new HttpException(500, 'Invalid Token Generation', [
        'Error in token generation',
      ]);
    }
    sendVerificationEmail(patient.email, token, 'patients');

    return res.status(201).json({
      status: 'success',
      data: {
        message: `${patient.patientName} Sign up successfully ,please verify your email`,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

// login

export const login = async (
  req: Request<{}, {}, LoginPatientInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const patient = await findPatientByEmail(req.body.email);
    if (!patient) {
      throw new HttpException(400, 'Invalid email or password', [
        'Email or password is incorrect',
      ]);
    }
    const isMatch = await patient.comparePassword(req.body.password);
    if (!isMatch) {
      throw new HttpException(400, 'Invalid email or password', [
        'Email or password is incorrect',
      ]);
    }

    if (!patient.isVerified) {
      throw new HttpException(400, 'Please Verify Your Email', [
        'Email is not verified yet',
      ]);
    }

    const token = jwt.sign({ _id: patient._id }, key);
    const { password: _, ...result } = patient.toObject();
    res.status(200).json({
      status: 'success',
      data: { token, result },
    });
  } catch (err: any) {
    next(err);
  }
};

// verify Email

export const verifyEmail = async (
  req: Request<{}, {}, VerifyEmailPatientInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const decode = jwt.verify(req.body.token, key) as JwtPayload;
    const patient = await findPatientById(decode._id);
    if (!patient) {
      throw new HttpException(400, 'Patient not Found', [
        'patient does not exist',
      ]);
    }
    if (patient.isVerified) {
      throw new HttpException(400, 'Email is Already verified please login', [
        'Email is verified',
      ]);
    }
    patient.isVerified = true;
    await patient.save();
    res.status(200).json({
      status: 'success',
      data: { message: 'Your Email Is Verified Successfully Please Log in' },
    });
  } catch (err: any) {
    next(err);
  }
};

// forgor password
export const forgotPassword = async (
  req: Request<{}, {}, ForgotPasswordPatientInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.body;
    const patient = await findPatientByEmail(email);
    if (patient) {
      const secret = patient.password + '-' + key;
      const token = jwt.sign({ _id: patient._id }, secret, {
        expiresIn: '15m',
      });

      if (!token) {
        throw new HttpException(500, 'Invalid Token Generation', [
          'Error in token generation',
        ]);
      }
      sendResetPasswordEmail(patient.email, token, 'patients');
    }
    res.status(200).json({
      status: 'success',
      date: {
        message: `If the email: ${email} exists in the system, a reset password link will be sent to it`,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

// Reset password

export const resetPassword = async (
  req: Request<{}, {}, ResetPasswordPatientInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { token, password } = req.body;

    const decoded = jwt.decode(token) as JwtPayload;
    if (!decoded?._id) {
      throw new HttpException(401, 'Invalid Token', ['Invalid Token']);
    }
    const patient = await findPatientById(decoded._id);
    if (!patient) {
      throw new HttpException(401, 'Invalid Token', ['Invalid Token']);
    }
    const secret = patient.password + '-' + key;
    jwt.verify(token, secret);
    patient.password = password;
    await patient.save();

    res.status(200).json({
      status: 'success',
      data: { message: `${patient.patientName} password reset successfully` },
    });
  } catch (err: any) {
    next(err);
  }
};

// update Me

export const updateMe = async (
  req: Request<{}, {}, UpdatePatientInput>,
  res: Response,
  next: NextFunction,
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
    next(err);
  }
};
// change password

export const changePassword = async (
  req: Request<{}, {}, ChangePasswordPatientInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const patient = await findPatientById(req.body.auth.id, {});
    if (!patient) {
      throw new HttpException(400, 'Patient not Found', [
        'patient does not exist',
      ]);
    }
    const isMatch = await patient.comparePassword(oldPassword);
    if (!isMatch) {
      throw new HttpException(400, 'Password is incorrect please try again', [
        'Invalid Password',
      ]);
    }
    patient.password = newPassword;
    await patient.save();
    res.status(200).json({
      status: 'success',
      data: { message: 'Password changed successfully' },
    });
  } catch (err: any) {
    next(err);
  }
};

// Delete My Account

export const deleteMyAccount = async (
  req: Request<{}, {}, DeleteMyAccountPatientInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    await findPatientByIdAndDelete(req.body.auth.id);

    return res.status(204).json({
      status: 'success',
      data: 'Your Account is deleted successfully',
    });
  } catch (err: any) {
    next(err);
  }
};
// Save image
export const saveProfileImage = async (
  req: Request<{}, {}, SaveImageInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const patient = await findPatientByIdAndUpdate(req.body.auth.id, {
      avatar: req.body.imageURL,
    }).select('-password');
    return res.status(200).json({
      status: 'success',
      data: patient,
    });
  } catch (err: any) {
    next(err);
  }
};

//my info

export const myInfo = async (
  req: Request<{}, {}, MyInfoPatientInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const patient = await findPatientById(req.body.auth.id).select('-password');
    return res.status(200).json({
      status: 'success',
      data: {
        patient,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

// create comment

export const createComment = async (
  req: Request<CreateCommentParamsInput, {}, CreateCommentBodyInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const comment = await createPatientComment(
      req.body.auth.id,
      req.params.id,
      req.body.text,
    );
    return res.status(200).json({
      status: 'success',
      data: {
        comment,
      },
    });
  } catch (err: any) {
    next(err);
  }
};
export const deleteComment = async (
  req: Request<DeleteCommentParamsInput, {}, DeleteCommentBodyInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const comment = await findCommentByIdAndDelete(
      req.body.auth.id,
      req.params.id,
    );
    console.log(comment);
    return res.status(204).json({
      status: 'success',
    });
  } catch (err: any) {
    next(err);
  }
};

export const updateComment = async (
  req: Request<EditCommentParamsInput, {}, EditCommentBodyInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const comment = await editPatientComment(
      req.body.auth.id,
      req.body.text,
      req.params.id,
    );
    res.status(200).json({
      status: 'success',
      comment,
    });
  } catch (err: any) {
    next(err);
  }
};

export const Like = async (
  req: Request<LikePatientPostParamsInput, {}, LikePatientPostBodyInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const like = await LikePatientPost(req.body.auth.id, req.params.id);
    return res.status(200).json({
      status: 'success',
      like,
    });
  } catch (err: any) {
    console.log(err.message);
    next(err);
  }
};

export const unlike = async (
  req: Request<LikePatientPostParamsInput, {}, LikePatientPostBodyInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    await unlikePatientPost(req.body.auth.id, req.params.id);
    return res.status(204).json({
      status: 'success',
      message: 'unlike post',
    });
  } catch (err: any) {
    next(err);
  }
};
